import * as THREE from 'three';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { clone } from '@/components/Scene/World/Utils/SkeletonUtils.js';

// Types
import type {
  AnimationAction,
  AnimationMixer,
  Group,
  Mesh,
  Vector3,
} from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import type { ISelf } from '@/models/modules';
import type { IUnit, IUnitThree, IUnitInfo } from '@/models/api';

// Constants
import { Audios, Animations, Names, Textures, Races, RacesConfig, Lifecycle } from '@/utils/constants';

export default class NPC {
  public name = Names.zombies;

  private _gltf!: GLTF;
  private _gltfBidens!: GLTF;
  private _gltfMutant!: GLTF;
  private _gltfOrc!: GLTF;
  private _gltfZombie!: GLTF;
  private _gltfSoldier!: GLTF;
  private _gltfCyborg!: GLTF;
  private _modelClone!: Group;
  private _modelBidens!: Group;
  private _modelMutant!: Group;
  private _modelOrc!: Group;
  private _modelZombie!: Group;
  private _modelSoldier!: Group;
  private _modelCyborg!: Group;
  private _mixer!: AnimationMixer;
  private _pseudoClone!: Mesh;
  private _sound!: Mesh;
  private _soundClone!: Mesh;
  private _weapon!: Group;
  private _weaponClone!: Group;
  private _scale!: Mesh;
  private _scaleClone!: Mesh;
  private _list: IUnitThree[];
  private _listNew: IUnit[];
  private _unit!: IUnit;
  private _listNewMin: IUnit[];
  private _listNow: IUnit[];
  private _listMerge: IUnit[];
  private _idsList: string[];
  private _idsListNew: string[];
  private _time = 0;
  private _npcThree!: IUnitThree;
  private _animation!: AnimationAction;
  private _target: Vector3;
  private _speed = 0;
  private _v1!: Vector3;
  private _v2!: Vector3;
  private _isFirstAnimate = false;
  private _usersLength!: number;
  private _npcLength!: number;
  private _distance!: number;
  private _box!: { x: number, y: number, z: number };
  private _isReady: boolean;

  constructor() {
    this._list = [];
    this._listNew = [];
    this._listNewMin = [];
    this._listNow = [];
    this._listMerge = [];
    this._idsList = [];
    this._idsListNew = [];
    this._target = new THREE.Vector3();
    this._isReady = false;
  }

  public init(self: ISelf): void {
    console.log('NPC init!!!');

    self.assets.GLTFLoader.load(
      './images/models/weapon--npc.glb',
      (model: GLTF) => {
        this._weapon = self.assets.traverseHelper(self, model).scene;
        this._weapon.scale.set(0.03, 0.03, 0.03);

        self.render();
        self.helper.loaderDispatchHelper(self.store, 'weaponNPC' as Names);
      },
    );

    const models = [
      Races.bidens,
      Races.mutant,
      Races.orc,
      Races.zombie,
      Races.soldier,
      Races.cyborg,
    ];
    models.forEach((name) => {
      self.assets.GLTFLoader.load(
        `./images/models/NPC/${name}.glb`,
        (model: GLTF) => {
          switch (name) {
            case Races.bidens:
              this._gltfBidens = model;
              console.log(`NPC ${name} ANIMATIONS: `, this._gltfBidens.animations);

              this._modelBidens = this._gltfBidens.scene;
              this._modelBidens.traverse((child: any) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (child.isMesh) {
                  child.castShadow = true;
                }
              });
              break;
            case Races.mutant:
              this._gltfMutant = model;
              console.log(`NPC ${name} ANIMATIONS: `, this._gltfMutant.animations);

              this._modelMutant = this._gltfMutant.scene;
              this._modelMutant.traverse((child: any) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (child.isMesh) {
                  child.castShadow = true;
                }
              });
              break;
            case Races.orc:
              this._gltfOrc = model;
              console.log(`NPC ${name} ANIMATIONS: `, this._gltfOrc.animations);

              this._modelOrc = this._gltfOrc.scene;
              this._modelOrc.traverse((child: any) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (child.isMesh) {
                  child.castShadow = true;
                }
              });
              break;
            case Races.zombie:
              this._gltfZombie = model;
              console.log(`NPC ${name} ANIMATIONS: `, this._gltfZombie.animations);

              this._modelZombie = this._gltfZombie.scene;
              this._modelZombie.traverse((child: any) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (child.isMesh) {
                  child.castShadow = true;
                }
              });
              break;
            case Races.soldier:
              this._gltfSoldier = model;
              console.log(`NPC ${name} ANIMATIONS: `, this._gltfSoldier.animations);

              this._modelSoldier = this._gltfSoldier.scene;
              this._modelSoldier.traverse((child: any) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (child.isMesh) {
                  child.castShadow = true;
                }
              });
              break;
            case Races.cyborg:
              this._gltfCyborg = model;
              console.log(`NPC ${name} ANIMATIONS: `, this._gltfCyborg.animations);

              this._modelCyborg = this._gltfCyborg.scene;
              this._modelCyborg.traverse((child: any) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (child.isMesh) {
                  child.castShadow = true;
                }
              });
              break;
          }

          self.helper.loaderDispatchHelper(self.store, name as unknown as Names);
        },
      );
    });

    // Звук
    this._sound = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      self.assets.getMaterial(Textures.hole),
    );
    this._sound.visible = false;

    // Показатель здоровья
    const scaleGeometry = new THREE.PlaneBufferGeometry(1, 0.05);
    this._scale = new THREE.Mesh(
      scaleGeometry,
      self.assets.getMaterial(Textures.scale),
    );

    self.helper.loaderDispatchHelper(self.store, this.name);
  }

  // Взять информацию о неписях которых видит игрок
  public getList(): IUnitInfo[] {
    return this._list
      .filter((unit) => unit.animation !== 'dead')
      .filter((unit) => this._idsList.includes(unit.id)).map((unit: IUnitThree) => {
        return {
          id: unit.id,
          pseudo: unit.pseudo,
          positionX: unit.positionX,
          positionY: unit.positionY,
          positionZ: unit.positionZ,
          race: unit.race,
        };
      });
  }

  // Добавить на сцену
  private _addNPC(self: ISelf, unit: IUnit): void {
    // console.log('NPC _addNPC()!!!', unit);

    this._box = RacesConfig[unit.race].box;
    this._modelClone = this._getModelCloneByRace(unit.race);
    this._pseudoClone = new THREE.Mesh(
      new THREE.BoxBufferGeometry(
        this._box.x,
        this._box.y,
        this._box.z,
      ),
      self.assets.getMaterial(Textures.pseudo),
    );
    this._pseudoClone.visible = Number(process.env.VUE_APP_TEST_MODE) === 1 ? true : false;

    this._soundClone = this._sound.clone();
    this._scaleClone = this._scale.clone();

    this._modelClone.position.set(
      unit.positionX,
      unit.positionY - this._box.y / 2,
      unit.positionZ,
    );

    if (RacesConfig[unit.race].isWeapon) {
      this._weaponClone = this._weapon.clone();
      this._weaponClone.visible = false;
    }

    if (unit.animation === 'dead') {
      this._modelClone.rotation.y = unit.directionY;
      this._pseudoClone.rotation.y = unit.directionY;
      this._setDeadPseudo(self, unit, this._pseudoClone, this._box.y);
    } else {
      this._pseudoClone.quaternion.copy(this._modelClone.quaternion);
      this._pseudoClone.position.set(
        this._modelClone.position.x,
        this._modelClone.position.y + this._box.y / 2,
        this._modelClone.position.z,
      );
    }
    this._soundClone.position.set(
      this._modelClone.position.x,
      this._modelClone.position.y + this._box.y / 2,
      this._modelClone.position.z,
    );
    this._scaleClone.setRotationFromMatrix(self.camera.matrix);
    this._scaleClone.position.set(
      this._modelClone.position.x,
      this._modelClone.position.y + this._box.y + 1,
      this._modelClone.position.z,
    );
    this._scaleClone.scale.set(unit.health * this._box.y / 200, 1, unit.health / 200 * this._box.y);

    this._mixer = new THREE.AnimationMixer(this._modelClone);
    this._npcThree = {
      ...unit,
      isRun: false,
      isMove: false,
      isNotJump: false,
      health: unit.health,
      animation: unit.animation,
      isOnHit: unit.isOnHit,
      model: this._modelClone.uuid,
      pseudo: this._pseudoClone.uuid,
      sound: this._soundClone.uuid,
      scale: this._scaleClone.uuid,
      weapon: RacesConfig[unit.race].isWeapon ? this._weaponClone.uuid : '',
      fire: '',
      text: null,
      isHide: false,
      mixer: this._mixer,
      prevAction: this._getAnimation(
        unit.race,
        this._mixer,
        unit.animation as Animations,
        true,
      ),
      nextAction: this._getAnimation(
        unit.race,
        this._mixer,
        unit.animation as Animations,
        true,
      ),
      isFire: false,
      isFireOff: false,
      fireScale: 0,
      isDead: unit.lifecycle === Lifecycle.dead,
      fireTimer: 0,
      isStepsPlay: false,
      isStepsStop: false,
      isIdlePlay: false,
      isIdleStop: false,
    };
    this._npcThree.prevAction.play();
    self.scene.add(this._modelClone);
    self.scene.add(this._pseudoClone);
    self.scene.add(this._soundClone);
    if (RacesConfig[unit.race].isWeapon) self.scene.add(this._weaponClone);
    if (unit.animation !== 'dead') self.scene.add(this._scaleClone);

    // Добавляем звуки
    if (this._soundClone) this._setSounds(self, this._npcThree);

    // Обновляем миксер
    this._mixer.update(self.events.delta);

    // В список
    this._list.push(this._npcThree);
  }

  // Выкинуть со сцены
  private _removeNPC(self: ISelf, unit: IUnitThree): void {
    // console.log('NPC _removeNPC(): ', unit.id);
    this._modelClone = self.scene.getObjectByProperty(
      'uuid',
      unit.model,
    ) as Group;
    if (this._modelClone) this._modelClone.removeFromParent();
    this._pseudoClone = self.scene.getObjectByProperty(
      'uuid',
      unit.pseudo,
    ) as Mesh;
    if (this._pseudoClone) this._pseudoClone.removeFromParent();
    this._soundClone = self.scene.getObjectByProperty(
      'uuid',
      unit.sound,
    ) as Mesh;
    if (this._soundClone) {
      self.audio.removeObjectAudioFromBus(this._soundClone.uuid);
      this._soundClone.removeFromParent();
    }
    this._scaleClone = self.scene.getObjectByProperty(
      'uuid',
      unit.scale,
    ) as Mesh;
    if (this._scaleClone) this._scaleClone.removeFromParent();
    if (RacesConfig[unit.race].isWeapon) {
      this._weaponClone = self.scene.getObjectByProperty(
        'uuid',
        unit.weapon,
      ) as Group;
      if (this._weaponClone) this._weaponClone.removeFromParent();
    }
    this._list = this._list.filter((npc) => npc.id !== unit.id);
  }

  private _animateNPC(self: ISelf, unit: IUnitThree, info: IUnit): void {
    // Для все кроме окончательно умерших - сдвигаем объекты по данным
    if (!unit.isDead) {
      this._box = RacesConfig[unit.race].box;
      unit.positionX = info.positionX;
      unit.positionY = info.positionY;
      unit.positionZ = info.positionZ;
      unit.directionX = info.directionX;
      unit.directionY = info.directionY;
      unit.directionZ = info.directionZ;
      unit.directionW = info.directionW;
      unit.rotationY = info.rotationY;
      unit.health = info.health;
      unit.animation = info.animation;

      this._modelClone = self.scene.getObjectByProperty(
        'uuid',
        unit.model,
      ) as Group;
      if (this._modelClone) {
        this._speed = self.events.delta;
        if ((this._modelClone.rotation.y < info.rotationY - this._speed * 1.1) ||
          (this._modelClone.rotation.y > info.rotationY + this._speed * 1.1)) {
          this._modelClone.quaternion.slerp(new THREE.Quaternion(unit.directionX, unit.directionY, unit.directionZ, unit.directionW), 0.05);
        } else this._modelClone.quaternion.copy(new THREE.Quaternion(unit.directionX, unit.directionY, unit.directionZ, unit.directionW));

        this._target.set(info.positionX, info.positionY - this._box.y / 2, info.positionZ);
        this._distance = this._target.distanceTo(this._modelClone.position);
        this._speed = self.events.delta * this._distance * ((info.isJump || info.animation === 'hit') ? 4 : info.animation === 'run' ? 2 : 1);

        if (this._distance > 50) {
          console.log('Координаты юнита очень сильно изменились: ', this._distance);

          // Редчайший кейс - если мир это одна локация и непись релоцировался через сторону на другую
          this._modelClone.position.copy(this._target);
        } else {
          if (this._modelClone.position.x < this._target.x - this._speed * 1.1)
            this._modelClone.position.x += this._speed;
          else if (
            this._modelClone.position.x >
            this._target.x + this._speed * 1.1
          )
            this._modelClone.position.x -= this._speed;
          else this._modelClone.position.x = this._target.x;

          if (this._modelClone.position.y < this._target.y - this._speed * 1.1)
            this._modelClone.position.y += this._speed;
          else if (
            this._modelClone.position.y >
            this._target.y + this._speed * 1.1
          )
            this._modelClone.position.y -= this._speed;
          else this._modelClone.position.y = this._target.y;

          if (this._modelClone.position.z < this._target.z - this._speed * 1.1)
            this._modelClone.position.z += this._speed;
          else if (
            this._modelClone.position.z >
            this._target.z + this._speed * 1.1
          )
            this._modelClone.position.z -= this._speed;
          else this._modelClone.position.z = this._target.z;
        }

        // Коробка
        this._pseudoClone = self.scene.getObjectByProperty(
          'uuid',
          unit.pseudo,
        ) as Mesh;
        if (this._pseudoClone) {
          if (unit.animation === 'dead') {
            this._setDeadPseudo(self, unit, this._pseudoClone, this._box.y);
            if (RacesConfig[unit.race].isWeapon) {
              this._weaponClone = self.scene.getObjectByProperty(
                'uuid',
                unit.weapon,
              ) as Group;
              if (this._weaponClone.visible) this._weaponClone.visible = false;
            }
          } else {
            this._pseudoClone.quaternion.copy(this._modelClone.quaternion);
            this._pseudoClone.position.set(
              this._modelClone.position.x,
              this._modelClone.position.y + this._box.y / 2,
              this._modelClone.position.z,
            );
          }
        }
        // Звуки
        this._soundClone = self.scene.getObjectByProperty(
          'uuid',
          unit.sound,
        ) as Mesh;
        if (this._soundClone) {
          this._soundClone.position.set(
            this._modelClone.position.x,
            this._modelClone.position.y + this._box.y / 2,
            this._modelClone.position.z,
          );
        }
      }

      // Показатель здоровья
      this._scaleClone = self.scene.getObjectByProperty(
        'uuid',
        unit.scale,
      ) as Mesh;
      if (this._scaleClone) {
        this._scaleClone.setRotationFromMatrix(self.camera.matrix);
        this._scaleClone.position.set(
          this._modelClone.position.x,
          this._modelClone.position.y + this._box.y + 1,
          this._modelClone.position.z,
        );
        this._scaleClone.scale.set(unit.health / 200 * this._box.y, 1, unit.health / 200 * this._box.y);
      }

      if (RacesConfig[unit.race].isWeapon) {
        this._weaponClone = self.scene.getObjectByProperty(
          'uuid',
          unit.weapon,
        ) as Group;
        if (this._weaponClone) {
          this._weaponClone.position.set(
            this._modelClone.position.x,
            this._modelClone.position.y + (this._box.y * 4/5),
            this._modelClone.position.z,
          );
          this._weaponClone.quaternion.copy(this._modelClone.quaternion);
        }
      }

      // Выставляем анимацию модели по данным
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      unit.nextAction = this._setAnimation(info.animation, unit);

      // Если анимация изменилась - запускаем звуки
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (unit.prevAction['_clip'].name !== unit.nextAction['_clip'].name) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // console.log(unit.nextAction['_clip'].name);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (unit.nextAction['_clip'].name === 'attack' && RacesConfig[unit.race].isWeapon) {
          this._weaponClone = self.scene.getObjectByProperty(
            'uuid',
            unit.weapon,
          ) as Group;
          if (this._weaponClone) this._weaponClone.visible = true;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (unit.prevAction['_clip'].name === 'attack' && RacesConfig[unit.race].isWeapon) {
          this._weaponClone = self.scene.getObjectByProperty(
            'uuid',
            unit.weapon,
          ) as Group;
          if (this._weaponClone) this._weaponClone.visible = false;
        }

        this._v1 = new THREE.Vector3(unit.positionX, unit.positionY, unit.positionZ);
        this._v2 = new THREE.Vector3(self.camera.position.x, self.camera.position.y, self.camera.position.z);
        this._distance = this._v1.distanceTo(this._v2);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (unit.nextAction['_clip'].name === 'dead') {
          if (unit.isIdlePlay && !unit.isIdleStop) {
            this._pauseIdle(self, unit);
            unit.isIdlePlay = false;
          }
          if (unit.isStepsPlay && !unit.isStepsStop) {
            this._pauseSteps(self, unit);
            unit.isStepsPlay = false;
          }
          if (unit.isStepsStop) {
            unit.isStepsStop = false;
            unit.isStepsPlay = false;
          }
          if (unit.isIdleStop) {
            unit.isIdleStop = false;
            unit.isIdlePlay = false;
          }

          if (this._distance < process.env.VUE_APP_SOUND_MAX) {
            this._playDead(self, unit);
          }

          if (this._scaleClone) this._scaleClone.visible = false;
          setTimeout(() => {
            unit.isDead = true; // Все!
          }, 5000);
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (unit.isStepsStop && unit.nextAction['_clip'].name === 'run' || unit.nextAction['_clip'].name === 'back' || unit.nextAction['_clip'].name === 'walking') {
            if (this._distance < process.env.VUE_APP_SOUND_MAX / 2) {
              this._startSteps(self, unit);
            }
            unit.isStepsStop = false;
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (unit.isIdleStop && unit.nextAction['_clip'].name === 'idle') {
            if (this._distance < process.env.VUE_APP_SOUND_MAX) {
              this._startIdle(self, unit);
            }
            unit.isIdleStop = false;
          }
          
          if (unit.isStepsPlay) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if ((unit.nextAction['_clip'].name === 'kick' || unit.nextAction['_clip'].name === 'attack' || unit.nextAction['_clip'].name === 'cry' || unit.nextAction['_clip'].name === 'idle') ||
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ((unit.prevAction['_clip'].name === 'walking' && unit.nextAction['_clip'].name !== 'run' && unit.nextAction['_clip'].name !== 'back') ||
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              (unit.prevAction['_clip'].name === 'run' && unit.nextAction['_clip'].name !== 'walking' && unit.nextAction['_clip'].name !== 'back') &&
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              (unit.prevAction['_clip'].name === 'back' && unit.nextAction['_clip'].name !== 'walking' && unit.nextAction['_clip'].name !== 'run'))) {
              this._pauseSteps(self, unit);
              unit.isStepsPlay = false;
            } 
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (unit.nextAction['_clip'].name === 'run' || unit.nextAction['_clip'].name === 'back') {
              this._setStepsToRun(self, unit);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            } else if (unit.nextAction['_clip'].name === 'walking') {
              this._setStepsToWalk(self, unit);
            }
          } 
          
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (unit.isIdlePlay && unit.prevAction['_clip'].name === 'idle') {
            this._pauseIdle(self, unit);
            unit.isIdlePlay = false;
          }

          if (this._distance < process.env.VUE_APP_SOUND_MAX) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (unit.nextAction['_clip'].name === 'hit' || unit.nextAction['_clip'].name === 'cry' || unit.nextAction['_clip'].name === 'attack') {
              if (unit.isStepsPlay) {
                this._pauseSteps(self, unit);
                unit.isStepsStop = true;
              } else if (unit.isIdlePlay) {
                this._pauseIdle(self, unit);
                unit.isIdleStop = true;
              }
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              if (!(unit.nextAction['_clip'].name === 'attack' && (unit.race === Races.cyborg || unit.race === Races.soldier))) {
                setTimeout(() => {
                  this._playHit(self, unit);
                }, 700);
              }
            }
          }

          if (this._distance < process.env.VUE_APP_SOUND_MAX / 2) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (unit.nextAction['_clip'].name === 'jump') {
              setTimeout(() => {
                self.audio.startObjectSound(unit.sound, Audios.jumpstart);
              }, 1400);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            } else if (unit.prevAction['_clip'].name === 'jump') {
              setTimeout(() => {
                this._playJump(self, unit);
              }, 100);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            } else if (unit.nextAction['_clip'].name === 'kick') {
              setTimeout(() => {
                self.audio.startObjectSound(unit.sound, Audios.jumpstart);
              }, 400);
            }
          }
        }

        unit.prevAction.fadeOut(0.5);
        unit.nextAction.reset().fadeIn(0.5).play();
        unit.prevAction = unit.nextAction;
      }

      // Продвигаем миксер
      unit.mixer.update(self.events.delta);
    }
  }

  public animate(self: ISelf): void {
    // console.log('NPC: ', self.store.getters['api/game'].npc.length);
    if (!this._isReady) {
      this._isReady =
        Boolean(this._modelBidens) &&
        Boolean(this._modelCyborg) &&
        Boolean(this._modelMutant) &&
        Boolean(this._modelSoldier) &&
        Boolean(this._modelZombie) &&
        Boolean(this._modelOrc);
    } else {
      if (
        self.store.getters['api/game'] &&
        self.store.getters['api/game'].npc &&
        (self.store.getters['api/game'].npc.length || this._list.length)
      ) {
        this._time += self.events.delta;
        // Иногда запускаем пересборку массива "ближащих NPC"
        if (this._time > 1 || !this._list.length) {
          this._setNewList(self);
          this._time = 0;
  
          /*
          console.log('Пересборка и оптимизация СТАРТ: ',
          JSON.parse(
            JSON.stringify(this._listNewMin),
          ), JSON.parse(
            JSON.stringify(this._idsListNew),
          ), JSON.parse(
            JSON.stringify(this._listNow),
          ), JSON.parse(
            JSON.stringify(this._idsList),
          ));
          */
  
          // Самый первый раз
          if (!this._isFirstAnimate) {
            this._isFirstAnimate = true;
            // console.log('Самый первый раз!!!');
            this._listNewMin.forEach((npc) => {
              this._addNPC(self, npc);
            });
          } else {
            // Всегда потом
            this._listMerge = [...this._listNewMin];
            this._idsList.forEach((id) => {
              if (!this._idsListNew.includes(id)) {
                this._unit = this._listNow.find(
                  (unit: IUnit) => unit.id === id,
                ) as IUnit;
                this._listMerge.push(this._unit);
              }
            });
            this._listMerge.forEach((npc) => {
              // console.log('NPC ///////////////////////////////////////////////////////', npc.id);
              // Нет в новом списке - на удаление
              if (this._idsList.includes(npc.id) && !this._idsListNew.includes(npc.id)) {
                // console.log('Нет в новом списке - на удаление: ', this._idsListNew, npc.id);
                this._npcThree = this._list.find(
                  (unit: IUnitThree) => unit.id === npc.id,
                ) as IUnitThree;
                if (this._npcThree) {
                  // console.log('УДАЛЯЕМ: ', npc.id);
                  this._removeNPC(self, this._npcThree);
                }
                // Нет в старом списке - на добавлекние
              } else if (!this._idsList.includes(npc.id) && this._idsListNew.includes(npc.id)) {
                // console.log('Нет в старом списке - ДОБАВЛЯЕМ: ', npc.id);
                this._addNPC(self, npc);
                // Есть и там и там - анимируем
              } else if (this._idsList.includes(npc.id) && this._idsListNew.includes(npc.id)) {
                // console.log('Есть и там и там - анимируем: ', npc.id);
                this._npcThree = this._list.find(
                  (unit: IUnitThree) => unit.id === npc.id,
                ) as IUnitThree;
                if (this._npcThree) {
                  // console.log('АНИМИРУЕМ: ', npc.id);
                  this._animateNPC(self, this._npcThree, npc);
                }
              }
            });
          }
          this._listNow = [...this._listNewMin];
          this._idsList = [...this._idsListNew];
          /*
          console.log('Пересборка и оптимизация ФИНИШ: ', 
            JSON.parse(
              JSON.stringify(this._listNewMin),
            ), JSON.parse(
              JSON.stringify(this._idsListNew),
            ), JSON.parse(
              JSON.stringify(this._listNow),
            ), JSON.parse(
              JSON.stringify(this._idsList),
            )); */
        } else {
          this._listNow.forEach((npc) => {
            this._npcThree = this._list.find(
              (unit: IUnitThree) => unit.id === npc.id,
            ) as IUnitThree;
            if (this._npcThree) {
              this._animateNPC(self, this._npcThree, npc);
            }
          });
        }
      }
    }
  }

  // Оптимизация - показываем определенное количество ближайщих неписей
  private _setNewList(self: ISelf): void {
    this._listNew = JSON.parse(
      JSON.stringify(
        self.store.getters['api/game'].npc
          .filter((unit: { lifecycle: Lifecycle; }) => unit.lifecycle !== Lifecycle.born)
      ),
    ); // Не показываем только что рожденных
    this._usersLength = self.store.getters['api/game'].users.length - 1;
    if (this._usersLength < 10) this._npcLength = process.env.VUE_APP_ITEMS - this._usersLength;
    else this._npcLength = 5;
    this._listNewMin = this._listNew
      .sort((a: IUnit, b: IUnit) => {
        this._v1 = new THREE.Vector3(a.positionX, a.positionY, a.positionZ);
        this._v2 = new THREE.Vector3(b.positionX, b.positionY, b.positionZ);

        return (
          this._v1.distanceTo(self.camera.position) -
          this._v2.distanceTo(self.camera.position)
        );
      })
      .slice(0, this._npcLength); // Берем только ближайщиx в зависимости от количества игроков в локации
    this._idsListNew = this._listNewMin.map((npc: IUnit) => {
      return npc.id;
    });

    // Проверяем включены ли звуки на видимых
    this._listNew.forEach((npc) => {
      this._npcThree = this._list.find(
        (unit: IUnitThree) => unit.id === npc.id,
      ) as IUnitThree;
      if (this._npcThree) {
        this._v1 = new THREE.Vector3(npc.positionX, npc.positionY, npc.positionZ);
        this._v2 = new THREE.Vector3(self.camera.position.x, self.camera.position.y, self.camera.position.z);
  
        if (this._v1.distanceTo(this._v2) < process.env.VUE_APP_SOUND_MAX) {
          if (npc.animation === 'idle' &&
              !this._npcThree.isIdlePlay &&
              npc.lifecycle !== Lifecycle.attention) {
            this._startIdle(self, this._npcThree);
            this._npcThree.isIdlePlay = true;
          }
        } else {
          if (npc.animation === 'idle' && this._npcThree.isIdlePlay) {
            this._pauseIdle(self, this._npcThree);
            this._npcThree.isIdlePlay = false;
          }
        }

        if (this._v1.distanceTo(this._v2) < process.env.VUE_APP_SOUND_MAX / 2) {
          if (!this._npcThree.isStepsPlay &&
              (npc.animation === 'walking' ||
              npc.animation === 'run' ||
              npc.animation === 'back')) {
            this._startSteps(self, this._npcThree);
            this._npcThree.isStepsPlay = true;
          }
        } else {
          if (this._npcThree.isStepsPlay &&
            (npc.animation === 'walking' ||
            npc.animation === 'run' ||
            npc.animation === 'back')) {
            this._pauseSteps(self, this._npcThree);
            this._npcThree.isStepsPlay = false;
          }
        }
      }
    });
  }

  private _getModelCloneByRace(race: Races) {
    switch (race) {
      case Races.bidens:
        return clone(this._modelBidens);
      case Races.mutant:
        return clone(this._modelMutant);
      case Races.orc:
        return clone(this._modelOrc);
      case Races.zombie:
        return clone(this._modelZombie);
      case Races.soldier:
        return clone(this._modelSoldier);
      case Races.cyborg:
        return clone(this._modelCyborg);
    }
  }

  private _setAnimation(animation: string, unit: IUnitThree) {
    switch (animation) {
      case 'dead':
        return this._getAnimation(unit.race, unit.mixer, Animations.dead);
      case 'hit':
        return this._getAnimation(unit.race, unit.mixer, Animations.hit);
      case 'run':
        return this._getAnimation(unit.race, unit.mixer, Animations.run);
      case 'jump':
        return this._getAnimation(unit.race, unit.mixer, Animations.jump);
      case 'walking':
        return this._getAnimation(unit.race, unit.mixer, Animations.walking);
      case 'back':
        return this._getAnimation(unit.race, unit.mixer, Animations.back);
      case 'cry':
        return this._getAnimation(unit.race, unit.mixer, Animations.cry);
      case 'attack':
        return this._getAnimation(unit.race, unit.mixer, Animations.attack);
      case 'kick':
        return this._getAnimation(unit.race, unit.mixer, Animations.kick);
      case 'idle':
      default:
        return this._getAnimation(unit.race, unit.mixer, Animations.idle);
    }
  }

  private _getAnimation(
    race: Races,
    mixer: AnimationMixer,
    name: Animations,
    isStart = false,
  ): AnimationAction {
    switch (race) {
      case Races.bidens:
        this._gltf = this._gltfBidens;
        break;
      case Races.mutant:
        this._gltf = this._gltfMutant;
        break;
      case Races.orc:
        this._gltf = this._gltfOrc;
        break;
      case Races.zombie:
        this._gltf = this._gltfZombie;
        break;
      case Races.soldier:
        this._gltf = this._gltfSoldier;
        break;
      case Races.cyborg:
        this._gltf = this._gltfCyborg;
        break;
    }
    switch (name) {
      case Animations.attack:
        this._animation = mixer.clipAction(this._gltf.animations[0]);
        this._animation.setDuration(4);
        return this._animation;
      case Animations.back:
        return mixer.clipAction(this._gltf.animations[1]);
      case Animations.cry:
        return mixer.clipAction(this._gltf.animations[2]);
      case Animations.dead:
        this._animation = mixer.clipAction(this._gltf.animations[3]);
        this._animation.setLoop(THREE.LoopOnce, 1);
        this._animation.clampWhenFinished = true;
        if (isStart) this._animation.setDuration(0);
        return this._animation;
      case Animations.hit:
        return mixer.clipAction(this._gltf.animations[4]);
      case Animations.jump:
        this._animation = mixer.clipAction(this._gltf.animations[6]);
        this._animation.setLoop(THREE.LoopRepeat, Infinity);
        this._animation.clampWhenFinished = true;
        this._animation.setDuration(5);
        return this._animation;
      case Animations.kick:
        return mixer.clipAction(this._gltf.animations[7]);
      case Animations.run:
        return mixer.clipAction(this._gltf.animations[8]);
      case Animations.walking:
        this._animation = mixer.clipAction(this._gltf.animations[9]);
        this._animation.setLoop(THREE.LoopRepeat, Infinity);
        this._animation.setDuration(1);
        return this._animation;
    }
    return mixer.clipAction(this._gltf.animations[5]);
  }

  private _setSounds(self: ISelf, unit: IUnitThree) {
    switch (unit.race) {
      case Races.bidens:
        self.audio.addAudioOnObject(self, unit.sound, Audios.mutantsteps);
        self.audio.addAudioOnObject(
          self,
          unit.sound,
          Audios.jumpstart,
        );
        self.audio.addAudioOnObject(self, unit.sound, Audios.mutantjumpend);
        self.audio.addAudioOnObject(self, unit.sound, Audios.bidensidle);
        self.audio.addAudioOnObject(self, unit.sound, Audios.bidenshit);
        self.audio.addAudioOnObject(self, unit.sound, Audios.bidensdead);

        self.audio.setVolumeOnObjectSound(unit.sound, Audios.jumpstart, 1);
        self.audio.setPlaybackRateOnObjectSound(unit.sound, Audios.mutantsteps, 1.6);
        break;
      case Races.mutant:
        self.audio.addAudioOnObject(self, unit.sound, Audios.mutantsteps);
        self.audio.addAudioOnObject(
          self,
          unit.sound,
          Audios.jumpstart,
        );
        self.audio.addAudioOnObject(self, unit.sound, Audios.mutantjumpend);
        self.audio.addAudioOnObject(self, unit.sound, Audios.mutantidle);
        self.audio.addAudioOnObject(self, unit.sound, Audios.mutanthit);
        self.audio.addAudioOnObject(self, unit.sound, Audios.mutantdead);

        self.audio.setVolumeOnObjectSound(unit.sound, Audios.jumpstart, 1);
        self.audio.setPlaybackRateOnObjectSound(unit.sound, Audios.mutantsteps, 1.6);
        break;
      case Races.orc:
        self.audio.addAudioOnObject(self, unit.sound, Audios.steps);
        self.audio.addAudioOnObject(
          self,
          unit.sound,
          Audios.jumpstart,
        );
        self.audio.addAudioOnObject(self, unit.sound, Audios.jumpend);
        self.audio.addAudioOnObject(self, unit.sound, Audios.orcidle);
        self.audio.addAudioOnObject(self, unit.sound, Audios.orchit);
        self.audio.addAudioOnObject(self, unit.sound, Audios.orcdead);

        self.audio.setPlaybackRateOnObjectSound(unit.sound, Audios.steps, 0.8);
        self.audio.setVolumeOnObjectSound(unit.sound, Audios.jumpend, 0.5);
        self.audio.setVolumeOnObjectSound(unit.sound, Audios.steps, 0.5);
        break;
      case Races.zombie:
        self.audio.addAudioOnObject(self, unit.sound, Audios.steps);
        self.audio.addAudioOnObject(
          self,
          unit.sound,
          Audios.jumpstart,
        );
        self.audio.addAudioOnObject(self, unit.sound, Audios.jumpend);
        self.audio.addAudioOnObject(self, unit.sound, Audios.zombieidle);
        self.audio.addAudioOnObject(self, unit.sound, Audios.zombiehit);
        self.audio.addAudioOnObject(self, unit.sound, Audios.zombiedead);

        self.audio.setPlaybackRateOnObjectSound(unit.sound, Audios.steps, 0.6);
        break;
      case Races.soldier:
        self.audio.addAudioOnObject(self, unit.sound, Audios.steps);
        self.audio.addAudioOnObject(
          self,
          unit.sound,
          Audios.jumpstart,
        );
        self.audio.addAudioOnObject(self, unit.sound, Audios.jumpend);
        self.audio.addAudioOnObject(self, unit.sound, Audios.soldieridle);
        self.audio.addAudioOnObject(self, unit.sound, Audios.soldierhit);
        self.audio.addAudioOnObject(self, unit.sound, Audios.soldierdead);

        self.audio.setPlaybackRateOnObjectSound(unit.sound, Audios.steps, 0.6);
        break;
      case Races.cyborg:
        self.audio.addAudioOnObject(self, unit.sound, Audios.cyborgsteps);
        self.audio.addAudioOnObject(
          self,
          unit.sound,
          Audios.jumpstart,
        );
        self.audio.addAudioOnObject(self, unit.sound, Audios.jumpend);
        self.audio.addAudioOnObject(self, unit.sound, Audios.cyborghit);
        self.audio.addAudioOnObject(self, unit.sound, Audios.cyborgidle);
        self.audio.addAudioOnObject(self, unit.sound, Audios.cyborgdead);

        self.audio.setPlaybackRateOnObjectSound(unit.sound, Audios.cyborgsteps, 1.7);
        break;
    }
  }

  private _playHit(self: ISelf, unit: IUnitThree) {
    switch (unit.race) {
      case Races.bidens:
        self.audio.replayObjectSound(unit.sound, Audios.bidenshit);
        break;
      case Races.mutant:
        self.audio.replayObjectSound(unit.sound, Audios.mutanthit);
        break;
      case Races.orc:
        self.audio.replayObjectSound(unit.sound, Audios.orchit);
        break;
      case Races.zombie:
        self.audio.replayObjectSound(unit.sound, Audios.zombiehit);
        break;
      case Races.soldier:
        self.audio.replayObjectSound(unit.sound, Audios.soldierhit);
        break;
      case Races.cyborg:
        self.audio.replayObjectSound(unit.sound, Audios.cyborghit);
        break;
    }
  }

  private _playDead(self: ISelf, unit: IUnitThree) {
    switch (unit.race) {
      case Races.bidens:
        if (unit.isIdlePlay) self.audio.stopObjectSound(unit.sound, Audios.bidensidle);
        if (unit.isStepsPlay) self.audio.stopObjectSound(unit.sound, Audios.mutantsteps);
        self.audio.startObjectSound(unit.sound, Audios.bidensdead);
        break;
      case Races.mutant:
        if (unit.isIdlePlay) self.audio.stopObjectSound(unit.sound, Audios.mutantidle);
        if (unit.isStepsPlay) self.audio.stopObjectSound(unit.sound, Audios.mutantsteps);
        self.audio.startObjectSound(unit.sound, Audios.mutantdead);
        break;
      case Races.orc:
        if (unit.isIdlePlay) self.audio.stopObjectSound(unit.sound, Audios.orcidle);
        if (unit.isStepsPlay) self.audio.stopObjectSound(unit.sound, Audios.steps);
        self.audio.startObjectSound(unit.sound, Audios.orcdead);
        break;
      case Races.zombie:
        if (unit.isIdlePlay) self.audio.stopObjectSound(unit.sound, Audios.zombieidle);
        if (unit.isStepsPlay) self.audio.stopObjectSound(unit.sound, Audios.steps);
        self.audio.startObjectSound(unit.sound, Audios.zombiedead);
        break;
      case Races.soldier:
        if (unit.isIdlePlay) self.audio.stopObjectSound(unit.sound, Audios.soldieridle);
        if (unit.isStepsPlay) self.audio.stopObjectSound(unit.sound, Audios.steps);
        self.audio.startObjectSound(unit.sound, Audios.soldierdead);
        break;
      case Races.cyborg:
        if (unit.isIdlePlay) self.audio.stopObjectSound(unit.sound, Audios.cyborgidle);
        if (unit.isStepsPlay) self.audio.stopObjectSound(unit.sound, Audios.cyborgsteps);
        self.audio.startObjectSound(unit.sound, Audios.cyborgdead);
        break;
    }
  }

  private _startSteps(self: ISelf, unit: IUnitThree) {
    switch (unit.race) {
      case Races.bidens:
      case Races.mutant:
        self.audio.startObjectSound(unit.sound, Audios.mutantsteps);
        break;
      case Races.orc:
      case Races.zombie:
      case Races.soldier:
        self.audio.startObjectSound(unit.sound, Audios.steps);
        break;
      case Races.cyborg:
        self.audio.startObjectSound(unit.sound, Audios.cyborgsteps);
        break;
    }
  }

  private _pauseSteps(self: ISelf, unit: IUnitThree) {
    switch (unit.race) {
      case Races.bidens:
      case Races.mutant:
        self.audio.pauseObjectSound(unit.sound, Audios.mutantsteps);
        break;
      case Races.orc:
        self.audio.pauseObjectSound(unit.sound, Audios.steps);
        break;
      case Races.zombie:
      case Races.soldier:
        self.audio.pauseObjectSound(unit.sound, Audios.steps);
        break;
      case Races.cyborg:
        self.audio.pauseObjectSound(unit.sound, Audios.cyborgsteps);
        break;
    }
  }

  private _setStepsToRun(self: ISelf, unit: IUnitThree) {
    switch (unit.race) {
      case Races.bidens:
      case Races.mutant:
        self.audio.setPlaybackRateOnObjectSound(unit.sound, Audios.mutantsteps, 2);
        break;
      case Races.orc:
        self.audio.setPlaybackRateOnObjectSound(unit.sound, Audios.steps, 1);
        break;
      case Races.zombie:
      case Races.soldier:
        self.audio.setPlaybackRateOnObjectSound(unit.sound, Audios.steps, 0.8);
        break;
      case Races.cyborg:
        self.audio.setPlaybackRateOnObjectSound(unit.sound, Audios.cyborgsteps, 1.8);
        break;
    }
  }

  private _setStepsToWalk(self: ISelf, unit: IUnitThree) {
    switch (unit.race) {
      case Races.bidens:
      case Races.mutant:
        self.audio.setPlaybackRateOnObjectSound(unit.sound, Audios.mutantsteps, 1.6);
        break;
      case Races.orc:
        self.audio.setPlaybackRateOnObjectSound(unit.sound, Audios.steps, 0.8);
        break;
        case Races.zombie:
      case Races.soldier:
        self.audio.setPlaybackRateOnObjectSound(unit.sound, Audios.steps, 0.6);
        break;
      case Races.cyborg:
        self.audio.setPlaybackRateOnObjectSound(unit.sound, Audios.cyborgsteps, 1.5);
        break;
    }
  }

  private _startIdle(self: ISelf, unit: IUnitThree) {
    switch (unit.race) {
      case Races.bidens:
        self.audio.startObjectSound(unit.sound, Audios.bidensidle);
        break;
      case Races.zombie:
        self.audio.startObjectSound(unit.sound, Audios.zombieidle);
        break;
      case Races.mutant:
        self.audio.startObjectSound(unit.sound, Audios.mutantidle);
        break;
      case Races.orc:
        self.audio.startObjectSound(unit.sound, Audios.orcidle);
        break;
      case Races.soldier:
        self.audio.startObjectSound(unit.sound, Audios.soldieridle);
        break;
      case Races.cyborg:
        self.audio.startObjectSound(unit.sound, Audios.cyborgidle);
        break;
    }
  }

  private _pauseIdle(self: ISelf, unit: IUnitThree) {
    switch (unit.race) {
      case Races.bidens:
        self.audio.pauseObjectSound(unit.sound, Audios.bidensidle);
        break;
      case Races.zombie:
        self.audio.pauseObjectSound(unit.sound, Audios.zombieidle);
        break;
      case Races.mutant:
        self.audio.pauseObjectSound(unit.sound, Audios.mutantidle);
        break;
      case Races.orc:
        self.audio.pauseObjectSound(unit.sound, Audios.orcidle);
        break;
      case Races.soldier:
        self.audio.pauseObjectSound(unit.sound, Audios.soldieridle);
        break;
      case Races.cyborg:
        self.audio.pauseObjectSound(unit.sound, Audios.cyborgidle);
        break;
    }
  }

  private _playJump(self: ISelf, unit: IUnitThree) {
    switch (unit.race) {
      case Races.bidens:
      case Races.mutant:
        self.audio.startObjectSound(unit.sound, Audios.mutantjumpend);
        break;
      case Races.orc:
      case Races.zombie:
      case Races.soldier:
      case Races.cyborg:
        self.audio.startObjectSound(unit.sound, Audios.jumpend);
        break;
    }
  }

  // Установить коробку для умершего
  private _setDeadPseudo(self: ISelf, unit: IUnit, box: Mesh, height: number): void {
    switch (unit.race) {
      case Races.bidens:
        box.scale.set(2, 0.4, 3.5);
        box.position.set(
          unit.positionX,
          unit.positionY - height / 2,
          unit.positionZ,
        ).add(
          self.helper
            .getForwardVectorFromObject(box)
            .negate()
            .multiplyScalar(4),
        ).add(
          self.helper
            .getSideVectorFromObject(box)
            .multiplyScalar(1.5),
        );
        break;
      case Races.mutant:
        box.scale.set(1.5, 0.6, 2.5);
        box.position.set(
          unit.positionX,
          unit.positionY - height / 2,
          unit.positionZ,
        ).add(
          self.helper
            .getForwardVectorFromObject(box)
            .negate()
            .multiplyScalar(2.5),
        ).add(
          self.helper
            .getSideVectorFromObject(box)
            .multiplyScalar(0.5),
        );
        break;
      case Races.orc:
        box.scale.set(2, 0.5, 2.5);
        box.position.set(
          unit.positionX,
          unit.positionY - height / 2,
          unit.positionZ,
        ).add(
          self.helper
            .getForwardVectorFromObject(box)
            .negate()
            .multiplyScalar(2),
        );
        break;
      case Races.zombie:
        box.scale.set(2.75, 0.5, 2.75);
        box.position.set(
          unit.positionX,
          unit.positionY - height / 2,
          unit.positionZ,
        ).add(
          self.helper
            .getSideVectorFromObject(box)
            .negate()
            .multiplyScalar(0.75),
        ).add(
          self.helper
            .getForwardVectorFromObject(box)
            .multiplyScalar(0.25),
        );
        break;
      case Races.soldier:
        box.scale.set(3, 0.5, 3);
        box.position.set(
          unit.positionX,
          unit.positionY - height / 2,
          unit.positionZ,
        ).add(
          self.helper
            .getForwardVectorFromObject(box)
            .multiplyScalar(1.5),
        ).add(
          self.helper
            .getSideVectorFromObject(box)
            .multiplyScalar(0.55),
        );
        break;
      case Races.cyborg:
        box.scale.set(2.7, 0.5, 2.7);
        box.position.set(
          unit.positionX,
          unit.positionY - height / 2,
          unit.positionZ,
        ).add(
          self.helper
            .getForwardVectorFromObject(box)
            .negate()
            .multiplyScalar(1),
        ).add(
          self.helper
            .getSideVectorFromObject(box)
            .multiplyScalar(0.25),
        );
        break;
    }
  }
}
