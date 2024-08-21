import * as THREE from 'three';

// Types
import type { ISelf } from '@/models/modules';
import type { IShot, IShotThree, IUnitInfo } from '@/models/api';
import type { Group, Mesh, Vector3 } from 'three';

// Constants
import { DESIGN, Textures } from '@/utils/constants';
import { EmitterEvents } from '@/models/api';

// Module
import emitter from '@/utils/emitter';
import { TResult } from '@/models/utils';
import Octree from '@/components/Scene/World/Math/Octree';

export default class Shots {
  private _list: IShotThree[];
  private _listNew: IShotThree[];
  private _enemies: IUnitInfo[];
  private _ids: number[];
  private _shot!: Mesh;
  private _shotClone: Mesh;
  private _shotItem!: IShotThree;
  private _result!: TResult;
  private _result2!: TResult;
  private _result3!: TResult;
  private _SIZE = 0.1;
  private _is = false;
  private _time = 0;
  private _p1!: Vector3;
  private _p2!: Vector3;
  private _index!: number;
  private _group!: Group;
  private _pseudo!: Mesh;
  private _pseudoClone!: Mesh;
  private _distance!: number;
  private _velocity: Vector3;
  private _id!: string;

  constructor() {
    this._list = [];
    this._listNew = [];
    this._enemies = [];
    this._ids = [];
    this._shotClone = new THREE.Mesh();
    this._velocity = new THREE.Vector3();
  }

  public init(self: ISelf): void {
    this._shot = new THREE.Mesh(
      new THREE.SphereGeometry(this._SIZE, 8, 8),
      self.assets.getMaterial(Textures.hole),
    );

    // Реагировать на ответ на выстрел
    emitter.on(EmitterEvents.onUnshot, (id) => {
      this._shotItem = this._list.find((item) => item.id === id) as IShotThree;
      if (this._shotItem) {
        this._shotClone = self.scene.getObjectByProperty(
          'uuid',
          this._shotItem.model,
        ) as Mesh;
        if (this._shotClone) this._shotClone.removeFromParent();
        this._list = this._list.filter((item) => item.id !== id);
      }
    });
  }

  // Ответ на выстрел
  public onShot(self: ISelf, shot: IShot): void {
    // console.log('Shots onShot!!!', shot);
    this._shotClone = this._shot.clone();
    this._shotClone.position.set(
      shot.positionX,
      shot.positionY,
      shot.positionZ,
    );
    // Если это собственный выстрел - скрываем на старте
    if (shot.player === self.store.getters['persist/id'])
      this._shotClone.visible = false;
    this._list.push({
      ...shot,
      model: this._shotClone.uuid,
    });
    self.scene.add(this._shotClone);
  }

  // Удаление выстрела
  private _unshot(id: number): void {
    emitter.emit(EmitterEvents.unshot, id);
  }

  // Взрыв
  private _explosion(shot: IShot, enemy: string): void {
    emitter.emit(EmitterEvents.explosion, { ...shot, enemy });
  }

  // Поиск противника по месту удара
  private _findEnemyOnShot(
    self: ISelf,
    position: Vector3,
    enemies: IUnitInfo[],
  ): string {
    this._enemies = enemies;
    this._enemies
      .filter((enemy) => new THREE.Vector3(enemy.positionX, enemy.positionY, enemy.positionZ).distanceTo(position) < 10)
      .sort((a: IUnitInfo, b: IUnitInfo) => {
        this._p1 = new THREE.Vector3(a.positionX, a.positionY, a.positionZ);
        this._p2 = new THREE.Vector3(b.positionX, b.positionY, b.positionZ);
        return this._p1.distanceTo(position) - this._p2.distanceTo(position);
      }).slice(0, 3);
    this._index = 0;
    while (this._index < this._enemies.length) {
      this._group = new THREE.Group();
      this._pseudo = self.scene.getObjectByProperty(
        'uuid',
        this._enemies[this._index].pseudo,
      ) as Mesh;
      if (this._pseudo) {
        this._pseudoClone = this._pseudo.clone();
        this._group.add(this._pseudoClone);
      }
      self.scene.add(this._group);
      self.octree3 = new Octree();
      self.octree3.fromGraphNode(this._group);
      this._result3 = self.octree3.sphereIntersect(
        new THREE.Sphere(position, this._SIZE * 5),
      );
      this._group.removeFromParent();
      if (this._result3) {
        this._id = this._enemies[this._index].id;
        break;
      }
      ++this._index;
    }
    return this._result3 ? this._id : '';
  }

  public animate(self: ISelf, enemies: IUnitInfo[]): void {
    if (
      self.store.getters['api/game'] &&
      self.store.getters['api/game'].weapon &&
      self.store.getters['api/game'].weapon.shots &&
      (self.store.getters['api/game'].weapon.shots.length || this._list.length)
    ) {
      this._is = false;
      this._time += self.events.delta;
      if (this._time > 1) {
        this._is = true;
        this._time = 0;
      }

      this._listNew = self.store.getters['api/game'].weapon.shots;
      if (this._is) this._ids = [];
      this._listNew.forEach((shot) => {
        if (this._is) this._ids.push(shot.id as number);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this._shotItem = this._list.find((item) => item.id === shot.id);
        if (this._shotItem && this._shotItem.model) {
          this._shotClone = self.scene.getObjectByProperty(
            'uuid',
            this._shotItem.model,
          ) as Mesh;
          if (this._shotClone) {
            this._distance = this._shotClone.position.distanceTo(
              new THREE.Vector3(shot.startX, shot.startY, shot.startZ),
            );

            this._velocity = new THREE.Vector3(
              shot.directionX,
              shot.directionY,
              shot.directionZ,
            );

            this._velocity.addScaledVector(
              this._velocity,
              self.helper.damping(self.events.delta) / 100,
            );
            if (this._distance > 10) {
              this._velocity.addScaledVector(
                new THREE.Vector3(0, -1, 0),
                (self.events.delta + 1) / 250 * this._distance,
              );
            }
            this._shotClone.position.add(
              this._velocity
                .clone()
                .multiplyScalar(
                  self.events.delta * DESIGN.GAMEPLAY.SHOTS_SPEED,
                ),
            );

            // Проверяем столкновения собственных выстрелов с миром и другими игроками
            if (shot.player === self.store.getters['persist/id']) {
              // С миром только если отлетел на 3 метра
              if (
                !this._shotClone.visible &&
                this._distance > 3
              )
                this._shotClone.visible = true; // Делаем выстрел игрока видимым при небольшом отлете

              /*
                self.scene.add(new THREE.ArrowHelper(this._direction, this._shotClone.position, 10, 0xffff00 ));
                this._direction.copy(self.camera.getWorldDirection(this._direction).normalize());
                this._direction.y = 0;
                this._result = self.octree2.rayIntersect(this._ray);
              */

              this._result =
                this._shotClone.visible &&
                self.octree.sphereIntersect(
                  new THREE.Sphere(this._shotClone.position, this._SIZE * 5),
                );
              this._result2 = self.octree3.sphereIntersect(
                new THREE.Sphere(this._shotClone.position, this._SIZE * 5),
              );
              this._id = '';
              if (this._result2)
                this._id = this._findEnemyOnShot(
                  self,
                  this._shotClone.position,
                  enemies,
                );
              if (this._result || this._result2)
                this._explosion(
                  {
                    ...shot,
                    positionX: this._shotClone.position.x,
                    positionY: this._shotClone.position.y,
                    positionZ: this._shotClone.position.z,
                  },
                  this._id,
                );

              // Сносим выстрел если он летит уже давно или упал слишклм низко
              if (self.helper.getUnixtime(new Date) - shot.time > 5) this._unshot(shot.id as number);
              if (this._shotClone.position.y < -1 && this._distance < 5) {
                this._explosion(
                  {
                    ...shot,
                    positionX: this._shotClone.position.x,
                    positionY: this._shotClone.position.y,
                    positionZ: this._shotClone.position.z,
                  },
                  this._id,
                );
                this._unshot(shot.id as number);
              }
            }
          }
        } else if (self.helper.getUnixtime(new Date) - shot.time > 1) this._unshot(shot.id as number);
      });

      if (this._is)
        this._list = this._list.filter((shot) =>
          this._ids.includes(shot.id as number),
        );
    }
  }
}
