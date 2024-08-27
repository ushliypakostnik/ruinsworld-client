import * as THREE from 'three';

// Types
import type { Group, Mesh } from 'three';
import type { ISelf } from '@/models/modules';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import type { IShot, IUnitInfo, IHitsUpdate, ILocation } from '@/models/api';

// Constants
import { Audios, Names, Textures } from '@/utils/constants';
import { EmitterEvents } from '@/models/api';

// Modules
import Atmosphere from '@/components/Scene/World/Atmosphere/Atmosphere';
import Players from '@/components/Scene/World/Players';
import NPC from '@/components/Scene/World/Enemies/NPC';
import Shots from '@/components/Scene/World/Weapon/Shots';
import Lights from '@/components/Scene/World/Weapon/Lights';
import Explosions from '@/components/Scene/World/Weapon/Explosions';
import Bloods from '@/components/Scene/World/Atmosphere/Bloods';
import Octree from '@/components/Scene/World/Math/Octree';

// Utils
import emitter from '@/utils/emitter';

export default class World {
  public name = Names.world;

  private _group!: Group;
  private _mesh!: Mesh;
  private _pseudo!: Mesh;
  private _list!: IUnitInfo[];
  private _deads!: Mesh[];

  // Modules
  private _athmosphere: Atmosphere;
  private _players: Players;
  private _shots: Shots;
  private _lights: Lights;
  private _explosions: Explosions;
  private _bloods: Bloods;
  private _npc: NPC;
  private _time = 0;

  constructor() {
    // Modules
    this._athmosphere = new Atmosphere();
    this._players = new Players();
    this._shots = new Shots();
    this._lights = new Lights();
    this._explosions = new Explosions();
    this._bloods = new Bloods();
    this._npc = new NPC();

    this._group = new THREE.Group();
    this._deads = [];
  }

  public init(self: ISelf): void {
    self.assets.GLTFLoader.load('./images/models/ground.glb', (model: GLTF) => {
      self.helper.loaderDispatchHelper(self.store, this.name);
      this._group = model.scene;
      this._group.position.y = -1;

      // Modules
      this._players.init(self);
      this._npc.init(self);
      this._athmosphere.init(self);
      this._shots.init(self);
      this._lights.init(self);
      this._explosions.init(self);
      this._bloods.init(self);

      // Реагировать на открытие двери
      emitter.on(EmitterEvents.door, (door) => {
        this._athmosphere.door(self, door as string);
      });

      // Реагировать на необходимость обновить двери
      emitter.on(EmitterEvents.doors, () => {
        this._updateOctre4(self);
      });

      // Реагировать на новый труп
      emitter.on(EmitterEvents.dead, (message: any) => {
        this._pseudo = self.scene.getObjectByProperty(
          'uuid',
          message.mesh as string,
        ) as Mesh;
        if (this._pseudo) {
          this._deads.push(this._pseudo);
        }
      });

      // Реагировать на ответ на подбор
      emitter.on(EmitterEvents.onPick, (message: any) => {
        this._pseudo = self.scene.getObjectByProperty(
          'uuid',
          message.uuid as string,
        ) as Mesh;
        if (this._pseudo) {
          this._deads = this._deads.filter((box) => box.uuid !== message.uuid);
          this._pseudo.removeFromParent();
        }

        self.store.dispatch('api/setApiState', {
          field: 'exp',
          value: message.exp,
        });
      });
    });
  }

  // Улучшение после того как локация построена
  public upgrade(self: ISelf): void {
    this._athmosphere.world.forEach((mesh) => {
      this._group.add(mesh);
    });

    // Создаем октодерево
    self.octree.fromGraphNode(this._group);

    self.scene.add(this._group);
    this._group.remove();

    // Нулевой элемент для второго дерева
    const pseudoGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    this._mesh = new THREE.Mesh(
      pseudoGeometry,
      self.assets.getMaterial(Textures.pseudo),
    );
    this._mesh.position.y = -3;

    // Создаем октодерево из дверей
    this._updateOctre4(self);

    // Добавляем звуки на двери
    this._athmosphere.doors.forEach((mesh) => {
      self.audio.addAudioOnObject(self, mesh.uuid, Audios.door);
      self.audio.setPlaybackRateOnObjectSound(mesh.uuid, Audios.door, 0.5);
    });

    self.render();
    self.helper.loaderDispatchHelper(self.store, this.name, true);
  }

  // Пересоздание октодерева дверей
  private _updateOctre4(self: ISelf): void {
    this._group = new THREE.Group();
    this._athmosphere.doors.forEach((mesh) => {
      this._group.add(mesh);
    });

    // Пересоздаем октодерево
    self.octree4 = new Octree();
    self.octree4.fromGraphNode(this._group);

    self.scene.add(this._group);
    this._group.remove();
  }

  // Пересоздание октодерева из ближайших игроков и неписей
  private _updateOctree2(self: ISelf): void {
    this._group = new THREE.Group();
    this._group.add(this._mesh);
    this._list
      .filter(
        (item) =>
          new THREE.Vector3(
            item.positionX,
            item.positionY,
            item.positionZ,
          ).distanceTo(self.camera.position) < 5,
      )
      .sort(
        (a, b) =>
          new THREE.Vector3(a.positionX, a.positionY, a.positionZ).distanceTo(
            self.camera.position,
          ) -
          new THREE.Vector3(b.positionX, b.positionY, b.positionZ).distanceTo(
            self.camera.position,
          ),
      )
      .slice(0, 3)
      .forEach((unit: IUnitInfo) => {
        this._pseudo = self.scene.getObjectByProperty(
          'uuid',
          unit.pseudo,
        ) as Mesh;
        if (this._pseudo) this._group.add(this._pseudo);
      });
    self.scene.add(this._group);
    self.octree2 = new Octree();
    self.octree2.fromGraphNode(this._group);
    this._group.remove();
  }

  // Пересоздание октодерева из игроков и неписей которых видит игрок
  private _updateOctree3(self: ISelf): void {
    this._group = new THREE.Group();
    this._group.add(this._mesh);
    this._list.forEach((unit: IUnitInfo) => {
      this._pseudo = self.scene.getObjectByProperty(
        'uuid',
        unit.pseudo,
      ) as Mesh;
      if (this._pseudo) this._group.add(this._pseudo);
    });
    self.scene.add(this._group);
    self.octree3 = new Octree();
    self.octree3.fromGraphNode(this._group);
    this._group.remove();
  }

  private _getNotDeadVisibleUnits(): IUnitInfo[] {
    return this._players.getList().concat(this._npc.getList());
  }

  public shot(self: ISelf): IShot | null {
    return this._players.shot(self);
  }

  public onShot(self: ISelf, shot: IShot): void {
    this._shots.onShot(self, shot);
  }

  public onHit(self: ISelf, ids: IHitsUpdate): void {
    // console.log('World onHit: ', ids);
    this._players.onHit(self, ids.users);
    this._bloods.onHit(
      self,
      this._list.filter((unit: IUnitInfo) =>
        [...ids.users, ...ids.npc].includes(unit.id),
      ),
    );
  }

  public animate(self: ISelf): void {
    this._time += self.events.delta;
    if (this._time > 0.25) {
      this._list = this._getNotDeadVisibleUnits();
      this._updateOctree2(self);
      this._updateOctree3(self);
      this._time = 0;
    }

    this._players.animate(
      self,
      this._athmosphere.world
        .concat(this._athmosphere.doors)
        .concat(this._athmosphere.point)
        .concat(this._deads),
    );
    this._npc.animate(self);
    this._athmosphere.animate(self);
    this._shots.animate(self, this._list);
    this._lights.animate(self);
    this._explosions.animate(self);
    this._bloods.animate(self);
  }
}
