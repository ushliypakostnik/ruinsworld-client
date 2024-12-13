import * as THREE from 'three';

// Types
import type { Group, Mesh, Vector3 } from 'three';
import type { ISelf } from '@/models/modules';
import type { IThing, IThingThree } from '@/models/api';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Constants
import {
  Names,
  Textures,
  Things as ThingsEnum,
  Picks,
  Colors,
} from '@/utils/constants';
import { EmitterEvents } from '@/models/api';

// Modules
import emitter from '@/utils/emitter';

export default class Things {
  public name = Names.things;

  private _modelGrenades!: Group;
  private _modelVodka!: Group;
  private _modelStew!: Group;
  private _modelClone!: Group;
  private _modelGo!: Group;
  private _pseudo!: Mesh;
  private _pseudoClone!: Mesh;
  private _pseudoClone2!: Mesh;
  private _pseudoClone3!: Mesh;
  private _v1!: Vector3;
  private _v2!: Vector3;
  private _isFirstAnimate = false;
  private _time = 0;
  private _list: IThingThree[];
  private _item!: IThingThree;
  private _listNew: IThing[];
  private _listNewMin: IThing[];
  private _listNow: IThing[];
  private _listMerge: IThing[];
  private _idsList: string[];
  private _idsListNew: string[];
  private _thing!: IThing;
  private _number!: number;

  constructor() {
    this._list = [];
    this._listNow = [];
    this._listNewMin = [];
    this._listNew = [];
    this._listMerge = [];
    this._idsList = [];
    this._idsListNew = [];
  }

  public init(self: ISelf): void {
    self.assets.GLTFLoader.load(
      `./images/models/${ThingsEnum.vodka}.glb`,
      (model: GLTF) => {
        this._modelVodka = self.assets.traverseHelper(self, model).scene;
        self.helper.loaderDispatchHelper(
          self.store,
          ThingsEnum.vodka as unknown as Names,
        );
      },
    );

    self.assets.GLTFLoader.load(
      `./images/models/${ThingsEnum.grenades}.glb`,
      (model: GLTF) => {
        this._modelGrenades = self.assets.traverseHelper(self, model).scene;
        self.helper.loaderDispatchHelper(
          self.store,
          ThingsEnum.grenades as unknown as Names,
        );
      },
    );

    self.assets.GLTFLoader.load(
      `./images/models/${ThingsEnum.stew}.glb`,
      (model: GLTF) => {
        this._modelStew = self.assets.traverseHelper(self, model).scene;
        self.helper.loaderDispatchHelper(
          self.store,
          ThingsEnum.stew as unknown as Names,
        );
      },
    );

    this._pseudoClone = new THREE.Mesh(
      new THREE.BoxBufferGeometry(
        1,
        1,
        0.1,
      ),
      self.assets.getMaterial(Textures.glass),
    );
    this._pseudoClone2 = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1),
      new THREE.MeshStandardMaterial({
        color: Colors.white,
        map: self.assets.getTexture(Textures.go),
      }),
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._pseudoClone2.material.map.repeat.set(1, 1);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._pseudoClone2.material.map.wrapS = this._pseudoClone2.material.map.wrapT = THREE.RepeatWrapping;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._pseudoClone2.material.map.encoding = THREE.sRGBEncoding;
    this._pseudoClone2.position.set(0, 0, 0.05);
    this._pseudoClone3 = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1),
      new THREE.MeshStandardMaterial({
        color: Colors.white,
        map: self.assets.getTexture(Textures.go),
      }),
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._pseudoClone2.material.map.repeat.set(1, 1);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._pseudoClone2.material.map.wrapS = this._pseudoClone2.material.map.wrapT = THREE.RepeatWrapping;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._pseudoClone2.material.map.encoding = THREE.sRGBEncoding;
    this._pseudoClone2.position.set(0, 0, -0.05);
    this._pseudoClone2.rotateY(self.helper.degreesToRadians(180));
    this._modelGo = new THREE.Group();
    this._modelGo.add(this._pseudoClone);
    this._modelGo.add(this._pseudoClone2);
    this._modelGo.add(this._pseudoClone3);
    /* this._modelGo.add(new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.5, 10, 0.5),
      new THREE.MeshStandardMaterial({
        color: Colors.white,
      })),
    ); */
    this._pseudo = new THREE.Mesh(
      new THREE.BoxBufferGeometry(2, 2, 2),
      self.assets.getMaterial(Textures.pseudo),
    );
    this._pseudo.visible = process.env.VUE_APP_TEST_MODE === '1';

    // Реагировать на подбор
    emitter.on(EmitterEvents.pick, (message: any) => {
      // console.log('Things EmitterEvents.pick: ', message.id, message.uuid);
      if (message.type === Picks.thing) {
        this._item = this._list.find(
          (unit: IThingThree) => unit.id === message.id,
        ) as IThingThree;
        if (this._item) this._removeThing(self, this._item);
      }
    });
  }

  private _addThing(self: ISelf, thing: IThing): void {
    this._number = 0.1;
    switch (thing.type) {
      case ThingsEnum.vodka:
        this._modelClone = this._modelVodka.clone();
        break;
      case ThingsEnum.grenades:
        this._modelClone = this._modelGrenades.clone();
        break;
      case ThingsEnum.stew:
        this._modelClone = this._modelStew.clone();
        break;
      case ThingsEnum.go:
        this._modelClone = this._modelGo.clone();
        this._number = -0.1;
        break;
    }

    this._pseudoClone = this._pseudo.clone();

    this._modelClone.scale.set(0.5, 0.5, 0.5);
    this._modelClone.position.set(thing.x, thing.y + this._number, thing.z);
    this._modelClone.rotateY(self.helper.degreesToRadians(thing.rotateY));
    this._modelClone.rotateX(self.helper.degreesToRadians(thing.rotateX));

    this._pseudoClone.position.set(thing.x, thing.y + 0.25, thing.z);
    this._pseudoClone.rotateY(self.helper.degreesToRadians(thing.rotateY));
    this._pseudoClone.name = `${thing.id} ${thing.type}`;

    this._item = {
      ...thing,
      model: this._modelClone.uuid,
      pseudo: this._pseudoClone.uuid,
    };
    self.scene.add(this._modelClone);
    self.scene.add(this._pseudoClone);

    this._list.push(this._item);

    // console.log('Things _addThing(): ', thing.id, this._modelClone.uuid, this._pseudoClone.uuid);
    emitter.emit(EmitterEvents.addThing, this._pseudoClone.uuid);
  }

  private _removeThing(self: ISelf, thing: IThingThree): void {
    // console.log('Things _removeThing!!!', thing.id);
    emitter.emit(EmitterEvents.removeThing, thing.pseudo);
    this._modelClone = self.scene.getObjectByProperty(
      'uuid',
      thing.model,
    ) as Group;
    if (this._modelClone) this._modelClone.removeFromParent();
    this._pseudoClone = self.scene.getObjectByProperty(
      'uuid',
      thing.pseudo,
    ) as Mesh;
    if (this._pseudoClone) this._pseudoClone.removeFromParent();
    this._list = this._list.filter((item) => item.id !== thing.id);
  }

  public animate(self: ISelf): void {
    if (
      self.store.getters['api/game'] &&
      self.store.getters['api/game'].things &&
      (self.store.getters['api/game'].things.length || this._list.length)
    ) {
      this._time += self.events.delta;

      // Пересборка и оптимизация
      if (this._time > 3 || !this._list.length) {
        this._setNewList(self);
        this._time = 0;

        // Самый первый раз
        if (!this._isFirstAnimate) {
          this._isFirstAnimate = true;
          // console.log('Самый первый раз!!!');
          this._listNewMin.forEach((thing) => {
            this._addThing(self, thing);
          });
        } else {
          // Всегда потом
          this._listMerge = [...this._listNewMin];
          this._idsList.forEach((id) => {
            if (!this._idsListNew.includes(id)) {
              this._thing = this._listNow.find(
                (thing: IThing) => thing.id === id,
              ) as IThing;
              this._listMerge.push(this._thing);
            }
          });
          this._listMerge.forEach((thing) => {
            // console.log('USER ///////////////////////////////////////////////////////', user.id);
            // Нет в новом списке - на удаление
            if (
              this._idsList.includes(thing.id) &&
              !this._idsListNew.includes(thing.id)
            ) {
              // console.log('Нет в новом списке - на удаление: ', this._idsListNew, user.id);
              this._item = this._list.find(
                (item: IThingThree) => item.id === thing.id,
              ) as IThingThree;
              if (this._item) {
                // console.log('УДАЛЯЕМ: ', user.id);
                this._removeThing(self, this._item);
              }
              // Нет в старом списке - на добавление
            } else if (
              !this._idsList.includes(thing.id) &&
              this._idsListNew.includes(thing.id)
            ) {
              // console.log('Нет в старом списке - ДОБАВЛЯЕМ: ', user.id);
              this._addThing(self, thing);
            }
          });
        }
        this._listNow = [...this._listNewMin];
        this._idsList = [...this._idsListNew];
      }
    }
  }

  // Новый список
  private _setNewList(self: ISelf): void {
    this._listNew = JSON.parse(
      JSON.stringify(self.store.getters['api/game'].things),
    );

    this._listNewMin = this._listNew
      .sort((a: IThing, b: IThing) => {
        this._v1 = new THREE.Vector3(a.x, a.y, a.z);
        this._v2 = new THREE.Vector3(b.x, b.y, b.z);

        return (
          this._v1.distanceTo(self.camera.position) -
          this._v2.distanceTo(self.camera.position)
        );
      })
      .slice(0, Number(process.env.VUE_APP_ITEMS));

    this._idsListNew = this._listNewMin.map((unit: IThing) => {
      return unit.id;
    });
  }
}
