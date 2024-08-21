import * as THREE from 'three';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { clone } from '@/components/Scene/World/Utils/SkeletonUtils.js';
import { Text } from 'troika-three-text';

// Types
import type {
  AnimationAction,
  AnimationMixer,
  Group,
  Mesh,
  Object3D,
  Vector3,
} from 'three';
import type { ISelf } from '@/models/modules';
import type { IUnit, IUnitThree, IUnitInfo } from '@/models/api';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Constants
import { Animations, Audios, Names, Textures, Races, DESIGN, Lifecycle } from '@/utils/constants';
import { EmitterEvents } from '@/models/api';

// Modules
import emitter from '@/utils/emitter';

export default class Enemies {
  public name = Names.enemies;

  private _isTest!: boolean;
  private _isTestLocal = Number(process.env.VUE_APP_TEST_MODE) === 1 ? true : false;

  private _gltf!: GLTF;
  private _modelHuman!: Group;
  private _modelReptil!: Group;
  private _modelClone!: Group;
  private _pseudo!: Mesh;
  private _pseudoClone!: Mesh;
  private _sound!: Mesh;
  private _soundClone!: Mesh;
  private _scale!: Mesh;
  private _scaleClone!: Mesh;
  private _name!: Text;
  private _isHide = false;
  private _isMove = false;
  private _isRun = false;
  private _isNotJump = false;
  private _isForward = false;
  private _isBackward = false;
  private _isLeft = false;
  private _isRight = false;
  private _isFire = false;
  private _user!: IUnit;
  private _userThree!: IUnitThree;
  private _target!: Vector3;
  private _speed!: number;
  private _weapon!: Group;
  private _weaponClone!: Group;
  private _weaponFire!: Object3D;
  private _animation!: string;
  private _action!: AnimationAction;

  private _isFirstAnimate = false;
  private _time = 0;
  private _timeRegeneration = 0;
  private _list: IUnitThree[];
  private _item!: IUnitThree;
  private _listNew: IUnit[];
  private _listNow: IUnit[];
  private _listMerge: IUnit[];
  private _idsList: string[];
  private _idsListNew: string[];
  private _id!: string;
  private _isOnHit2: boolean;

  private _mixer!: AnimationMixer;

  constructor() {
    this._target = new THREE.Vector3();

    this._list = [];
    this._listNow = [];
    this._listNew = [];
    this._listMerge = [];
    this._idsList = [];
    this._idsListNew = [];
    this._isOnHit2 = false;

    this._isTest =
      process.env.NODE_ENV === 'development' ? this._isTestLocal : false;
  }

  public init(self: ISelf): void {
    self.assets.GLTFLoader.load(
      './images/models/weapon--enemies.glb',
      (model: GLTF) => {
        this._weapon = self.assets.traverseHelper(self, model).scene;
        this._weapon.scale.set(0.03, 0.03, 0.03);

        self.render();
        self.helper.loaderDispatchHelper(self.store, 'weaponEnemies' as Names);
      },
    );

    self.assets.GLTFLoader.load(
      `./images/models/${Races.human}.glb`,
      (model: GLTF) => {
        this._gltf = model;

        console.log('human animation: ', this._gltf.animations);

        this._modelHuman = this._gltf.scene;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._modelHuman.traverse((child: any) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (child.isMesh) {
            child.castShadow = true;
          }
        });
        self.helper.loaderDispatchHelper(self.store, Races.human as unknown as Names);
      },
    );

    self.assets.GLTFLoader.load(
      `./images/models/${Races.reptiloid}.glb`,
      (model: GLTF) => {
        this._gltf = model;

        console.log('reptiloid animation: ', this._gltf.animations);

        this._modelReptil = this._gltf.scene;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._modelReptil.traverse((child: any) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (child.isMesh) {
            child.castShadow = true;
          }
        });
        self.helper.loaderDispatchHelper(self.store, Races.reptiloid as unknown as Names);
      },
    );

    const pseudoGeometry = new THREE.BoxBufferGeometry(
      0.6,
      DESIGN.GAMEPLAY.PLAYER_HEIGHT - 0.2,
      0.75,
    );
    this._pseudo = new THREE.Mesh(
      pseudoGeometry,
      self.assets.getMaterial(Textures.pseudo),
    );
    this._pseudo.visible = false;

    this._sound = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      self.assets.getMaterial(Textures.hole),
    );
    this._sound.visible = false;

    const scaleGeometry = new THREE.PlaneBufferGeometry(1, 0.05);
    this._scale = new THREE.Mesh(
      scaleGeometry,
      self.assets.getMaterial(Textures.scale),
    );

    // Реагировать на переход на другую локацию
    emitter.on(EmitterEvents.onRelocation, (id) => {
      this._item = this._list.find((user) => user.id === id) as IUnitThree;
      if (this._item) this._removePlayer(self, this._item);
    });
  }

  // Взять информацию о противниках
  public getList(): IUnitInfo[] {
    return this._list
      .filter((player) => player.animation !== 'dead')
      .map((player) => {
        return {
          id: player.id,
          pseudo: player.pseudo,
          positionX: player.positionX,
          positionY: player.positionY,
          positionZ: player.positionZ,
          race: player.race as Races,
        };
      });
  }

  private _addPlayer(self: ISelf, player: IUnit): void {
    console.log('Enemies _addPlayer(): ', player);
    this._isHide = player.animation.includes('hide');

    if (player.race === Races.reptiloid) this._modelClone = clone(this._modelReptil);
    else this._modelClone = clone(this._modelHuman);

    this._pseudoClone = this._pseudo.clone();
    if (this._isHide) this._pseudoClone.scale.set(1, 0.6, 1);
    else this._pseudoClone.scale.set(1, 1, 1);

    this._soundClone = this._sound.clone();

    this._scaleClone = this._scale.clone();

    this._name = new Text();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._name.text = player.name;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._name.fontSize = 0.25;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._name.color = 0xffffff;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._name.sync();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    self.scene.add(this._name);

    this._weaponClone = this._weapon.clone();
    this._weaponClone.traverse((child: Object3D) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (child.isMesh && child.name.includes('fire')) {
        this._weaponFire = child;
        this._weaponFire.visible = false;
      }
    });

    this._modelClone.position.set(
      player.positionX,
      player.positionY,
      player.positionZ,
    );

    this._mixer = new THREE.AnimationMixer(this._modelClone);
    this._userThree = {
      ...player,
      isRun: false,
      isMove: false,
      isNotJump: false,
      health: player.health,
      animation: player.animation,
      isOnHit: player.isOnHit,
      model: this._modelClone.uuid,
      pseudo: this._pseudoClone.uuid,
      sound: this._soundClone.uuid,
      scale: this._scaleClone.uuid,
      weapon: this._weaponClone.uuid,
      fire: this._weaponFire.uuid,
      text: this._name,
      isHide: this._isHide,
      mixer: this._mixer,
      prevAction: this._getAnimation(
        this._mixer,
        player.animation as Animations,
        true,
      ),
      nextAction: this._getAnimation(
        this._mixer,
        player.animation as Animations,
        true,
      ),
      isFire: false,
      isFireOff: false,
      fireScale: 0,
      isDead: player.animation === 'dead',
      fireTimer: 0,
      isStepsPlay: false,
      isStepsStop: false,
      isIdlePlay: false,
      isIdleStop: false,
    };
    this._userThree.prevAction.play();
    self.scene.add(this._modelClone);
    self.scene.add(this._pseudoClone);
    self.scene.add(this._soundClone);
    self.scene.add(this._scaleClone);
    self.scene.add(this._weaponClone);

    // Добавляем звуки
    if (this._soundClone) {
      self.audio.addAudioOnObject(self, this._soundClone.uuid, Audios.steps);
      self.audio.addAudioOnObject(
        self,
        this._soundClone.uuid,
        Audios.jumpstart,
      );
      self.audio.addAudioOnObject(self, this._soundClone.uuid, Audios.jumpend);
      self.audio.addAudioOnObject(self, this._soundClone.uuid, Audios.shot);
      self.audio.addAudioOnObject(self, this._soundClone.uuid, Audios.hit);
      self.audio.addAudioOnObject(self, this._soundClone.uuid, Audios.dead);
    }

    this._list.push(this._userThree);
  }

  private _removePlayer(self: ISelf, player: IUnitThree): void {
    // console.log('Enemies _removePlayer!!!', player);
    this._modelClone = self.scene.getObjectByProperty(
      'uuid',
      player.model,
    ) as Group;
    if (this._modelClone) this._modelClone.removeFromParent();
    this._pseudoClone = self.scene.getObjectByProperty(
      'uuid',
      player.pseudo,
    ) as Mesh;
    if (this._pseudoClone) this._pseudoClone.removeFromParent();
    this._soundClone = self.scene.getObjectByProperty(
      'uuid',
      player.sound,
    ) as Mesh;
    if (this._soundClone) {
      self.audio.removeObjectAudioFromBus(this._soundClone.uuid);
      this._soundClone.removeFromParent();
    }
    this._scaleClone = self.scene.getObjectByProperty(
      'uuid',
      player.scale,
    ) as Mesh;
    if (this._scaleClone) this._scaleClone.removeFromParent();
    this._weaponClone = self.scene.getObjectByProperty(
      'uuid',
      player.weapon,
    ) as Group;
    if (this._weaponClone) this._weaponClone.removeFromParent();
    this._list = this._list.filter((user) => user.id !== player.id);
  }

  // Урон игроков
  public onHit(self: ISelf, users: string[]): void {
    users.forEach((id: string) => {
      this._userThree = this._list.find(
        (player) => player.id === id,
      ) as IUnitThree;
      if (this._userThree)
        self.audio.replayObjectSound(this._userThree.sound, Audios.hit);
    });
  }

  public animate(self: ISelf): void {
    if (
      self.store.getters['api/game'] &&
      self.store.getters['api/game'].users &&
      (self.store.getters['api/game'].users.length || this._list.length)
    ) {
      this._time += self.events.delta;
      this._timeRegeneration += self.events.delta;

      // Востановление Здоровье игрока - героя - странно, но именно здесь
      if (this._timeRegeneration > 0.25) {
        this._id = self.store.getters['persist/id'];
        this._user = self.store.getters['api/game'].users.find(
          (user: IUnit) => user.id === this._id,
        );
        if (this._user) {
          self.store.dispatch('api/setApiState', {
            field: 'health',
            value: this._user.health,
          });

          if (this._user.health <= 0) {
            self.store.dispatch('persist/setPersistState', {
              field: 'isGameOver',
              value: true,
            });
          }

          if (this._user.isOnHit2 && !this._isOnHit2) {
            this._isOnHit2 = true;
            self.audio.replayHeroSound(Audios.hit);
            setTimeout(() => {
              this._isOnHit2 = false;
            }, 300);
          }
        }
      }

      // Пересборка и оптимизация
      if (this._time > 1 || !this._list.length) {
        this._setNewList(self);
        this._time = 0;

        /*
        console.log('Пересборка и оптимизация СТАРТ: ',
        JSON.parse(
          JSON.stringify(this._listNew),
        ), JSON.parse(
          JSON.stringify(this._idsListNew),
        ), JSON.parse(
          JSON.stringify(this._listNow),
        ), JSON.parse(
          JSON.stringify(this._idsList),
        )); */

        // Самый первый раз
        if (!this._isFirstAnimate) {
          this._isFirstAnimate = true;
          // console.log('Самый первый раз!!!');
          this._listNew.forEach((user) => {
            this._addPlayer(self, user);
          });
        } else {
          // Всегда потом
          this._listMerge = [...this._listNew];
          this._idsList.forEach((id) => {
            if (!this._idsListNew.includes(id)) {
              this._user = this._listNow.find(
                (unit: IUnit) => unit.id === id,
              ) as IUnit;
              this._listMerge.push(this._user);
            }
          });
          this._listMerge.forEach((user) => {
            // console.log('USER ///////////////////////////////////////////////////////', user.id);
            // Нет в новом списке - на удаление
            if (
              this._idsList.includes(user.id) &&
              !this._idsListNew.includes(user.id)
            ) {
              // console.log('Нет в новом списке - на удаление: ', this._idsListNew, user.id);
              this._item = this._list.find(
                (item: IUnitThree) => item.id === user.id,
              ) as IUnitThree;
              if (this._item) {
                // console.log('УДАЛЯЕМ: ', user.id);
                this._removePlayer(self, this._item);
              }
              // Нет в старом списке - на добавлекние
            } else if (
              !this._idsList.includes(user.id) &&
              this._idsListNew.includes(user.id)
            ) {
              // console.log('Нет в старом списке - ДОБАВЛЯЕМ: ', user.id);
              this._addPlayer(self, user);
              // Есть и там и там - анимируем
            } else if (
              this._idsList.includes(user.id) &&
              this._idsListNew.includes(user.id)
            ) {
              // console.log('Есть и там и там - анимируем: ', user.id);
              this._item = this._list.find(
                (item: IUnitThree) => item.id === user.id,
              ) as IUnitThree;
              if (this._item) {
                // console.log('АНИМИРУЕМ: ', user.id);
                this._animatePlayer(self, this._item);
              }
            }
          });
        }
        this._listNow = [...this._listNew];
        this._idsList = [...this._idsListNew];
        /*
        console.log('Пересборка и оптимизация ФИНИШ: ', 
          JSON.parse(
            JSON.stringify(this._listNew),
          ), JSON.parse(
            JSON.stringify(this._idsListNew),
          ), JSON.parse(
            JSON.stringify(this._listNow),
          ), JSON.parse(
            JSON.stringify(this._idsList),
          )); */
      } else {
        this._list.forEach((npc) => {
          this._item = this._list.find(
            (unit: IUnitThree) => unit.id === npc.id,
          ) as IUnitThree;
          if (this._item) {
            this._animatePlayer(self, this._item);
          }
        });
      }
    }
  }

  // Новый список
  private _setNewList(self: ISelf): void {
    if (this._isTest)
      this._listNew = JSON.parse(
        JSON.stringify(
          self.store.getters['api/game'].users
            .filter(
              (user: IUnit) => user.lifecycle !== Lifecycle.born,
            )
        ),
      );
    else
      this._listNew = JSON.parse(
        JSON.stringify(
          self.store.getters['api/game'].users
            .filter(
              (user: IUnit) => user.lifecycle !== Lifecycle.born,
            )
            .filter(
              (user: IUnit) => user.id !== self.store.getters['persist/id'],
            ),
        ),
      );
    this._idsListNew = this._listNew.map((npc: IUnit) => {
      return npc.id;
    });
  }

  private _redrawFire(self: ISelf, user: IUnitThree): void {
    if (!user.isFireOff) user.fireScale += self.events.delta * 50;
    else user.fireScale -= self.events.delta * 50;

    if (user.fireScale > 5) user.isFireOff = true;

    this._weaponFire = self.scene.getObjectByProperty(
      'uuid',
      user.fire,
    ) as Mesh;
    if (this._weaponFire) {
      if (user.fireScale >= 0)
        this._weaponFire.scale.set(
          user.fireScale * 1.5,
          user.fireScale * 1.5,
          user.fireScale * 1.5,
        );
      if (user.fireScale >= 5) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this._weaponFire.material.opacity = 1;
      } else if (user.fireScale < 0) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this._weaponFire.material.opacity = 0;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      } else this._weaponFire.material.opacity = user.fireScale / 5;
      this._weaponFire.rotateX(self.events.delta * -3);
      this._weaponFire.rotateZ(self.events.delta * -3);
      this._weaponFire.rotateY(self.events.delta * -3);

      if (user.fireScale < 0) {
        user.isFire = false;
        user.isFireOff = false;
        user.fireScale = 0;
        this._weaponFire.visible = false;
      }
    }
  }

  private _animatePlayer(self: ISelf, user: IUnitThree): void {
    this._user = self.store.getters['api/game'].users.find(
      (player: IUnit) => player.id === user.id,
    );

    if (this._user) {
      if (this._user.animation) user.animation = this._user.animation;
      if (this._user.isFire) this._isFire = this._user.isFire;
      else this._isFire = false;
      this._isNotJump = !user.animation.includes('jump');
      this._isHide = user.animation.includes('hide');
      this._isRun = user.animation.includes('run');
      this._isForward = user.animation.includes('forward');
      this._isBackward = user.animation.includes('back');
      this._isLeft = user.animation.includes('left');
      this._isRight = user.animation.includes('right');

      if (user.animation === 'dead') {
        if (!user.isDead) {
          user.isFire = false;
          user.isFireOff = false;
          user.fireScale = 0;
          this._weaponFire.visible = false;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this._weaponClone = self.scene.getObjectByProperty(
            'uuid',
            user.weapon,
          ) as Mesh;
          if (this._weaponClone.visible) this._weaponClone.visible = false;
          if (this._scaleClone.visible) this._scaleClone.visible = false;
          self.audio.replayObjectSound(user.sound, Audios.dead);
          user.isDead = true;
        }
      } else {
        if (this._isFire !== user.isFire) {
          this._weaponFire = self.scene.getObjectByProperty(
            'uuid',
            user.fire,
          ) as Mesh;
          if (this._weaponFire) {
            if (this._isFire) {
              user.isFireOff = false;
              user.fireScale = 0;
              this._weaponFire.visible = true;
              self.audio.replayObjectSound(user.fire, Audios.shot);
            } else {
              user.isFire = false;
              user.isFireOff = false;
              user.fireScale = 0;
              this._weaponFire.visible = false;
            }
          }
          user.isFire = this._isFire;
        }
        if (this._isFire) this._redrawFire(self, user);
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._modelClone = self.scene.getObjectByProperty(
        'uuid',
        user.model,
      ) as Mesh;

      if (this._modelClone) {
        if (user.animation !== 'dead') {
          // Steps sound
          this._isMove =
            this._isRun ||
            this._isForward ||
            this._isBackward ||
            this._isLeft ||
            this._isRight;
          if (this._isMove !== user.isMove) {
            if (this._isMove) {
              this._speed = this._isHide ? 0.5 : this._isRun ? 2 : 1;
              self.audio.setPlaybackRateOnObjectSound(
                user.pseudo,
                Audios.steps,
                this._speed,
              );
              self.audio.replayObjectSound(user.sound, Audios.steps);
            } else self.audio.stopObjectSound(user.sound, Audios.steps);

            user.isMove = this._isMove;
          }

          // Jumps sounds
          if (this._isNotJump !== user.isNotJump) {
            if (!this._isNotJump)
              self.audio.replayObjectSound(user.sound, Audios.jumpstart);
            else self.audio.replayObjectSound(user.sound, Audios.jumpend);

            user.isNotJump = this._isNotJump;
          }

          this._pseudoClone = self.scene.getObjectByProperty(
            'uuid',
            user.pseudo,
          ) as Mesh;
          if (this._pseudoClone) {
            if (this._isHide !== user.isHide) {
              if (this._isHide) this._pseudoClone.scale.set(1, 0.6, 1);
              else this._pseudoClone.scale.set(1, 1, 1);
              user.isHide = this._isHide;
            }
          }
        }

        if (user.animation === 'dead')
          user.nextAction = this._getAnimation(user.mixer, Animations.dead);
        else if (!user.isHide && user.animation === 'hit')
          user.nextAction = this._getAnimation(user.mixer, Animations.hit);
        else if (!this._isHide && this._isRun !== user.isRun) {
          if (this._isRun)
            user.nextAction = this._getAnimation(user.mixer, Animations.run);
          else user.nextAction = this._getMove(user.mixer);
          user.isRun = this._isRun;
        } else {
          if (!this._isNotJump && !this._isHide)
            user.nextAction = this._getAnimation(user.mixer, Animations.jump);
          else {
            if (this._isRun)
              user.nextAction = this._getAnimation(user.mixer, Animations.run);
            else user.nextAction = this._getMove(user.mixer);
          }
        }

        if (user.prevAction !== user.nextAction) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (user.prevAction['_clip'].name === 'firestand')
            user.fireTimer += self.events.delta;

          user.prevAction.fadeOut(0.25);
          user.nextAction.reset().fadeIn(0.25).play();
          user.prevAction = user.nextAction;
        }
        if (user.fireTimer) user.fireTimer += self.events.delta;
        if (user.fireTimer > 0.5) {
          user.fireTimer = 0;
        }

        user.mixer.update(self.events.delta);
      }

      this._target.set(
        this._user.positionX + (this._isTest ? 4 : 0),
        this._user.positionY - (!this._isHide ? 1.5 : 1),
        this._user.positionZ + (this._isTest ? 4 : 0),
      );

      this._item = this._list.find(
        (player) => player.id === this._user.id,
      ) as IUnitThree;
      if (this._item) {
        this._item.positionX = this._target.x;
        this._item.positionY = this._target.y;
        this._item.positionZ = this._target.z;
      }

      this._speed = this._isHide ? 0.5 : this._isRun ? 2.5 : 1;
      this._speed *= self.events.delta * 8;

      if (this._modelClone.position.x < this._target.x - this._speed * 1.1)
        this._modelClone.position.x += this._speed;
      else if (this._modelClone.position.x > this._target.x + this._speed * 1.1)
        this._modelClone.position.x -= this._speed;
      else this._modelClone.position.x = this._target.x;

      if (this._modelClone.position.z < this._target.z - this._speed * 1.1)
        this._modelClone.position.z += this._speed;
      else if (this._modelClone.position.z > this._target.z + this._speed * 1.1)
        this._modelClone.position.z -= this._speed;
      else this._modelClone.position.z = this._target.z;

      this._modelClone.position.y = this._target.y;

      this._pseudoClone.position.set(
        this._modelClone.position.x,
        this._modelClone.position.y +
          (!this._isHide
            ? DESIGN.GAMEPLAY.PLAYER_HEIGHT / 2 - 0.1
            : DESIGN.GAMEPLAY.PLAYER_HEIGHT / 2 - 0.4),
        this._modelClone.position.z,
      );

      this._soundClone.position.set(
        this._pseudoClone.position.x,
        this._pseudoClone.position.y,
        this._pseudoClone.position.z,
      );

      this._modelClone.quaternion.copy(new THREE.Quaternion(this._user.directionX, this._user.directionY, this._user.directionZ, this._user.directionW));
      this._modelClone.rotateY(-Math.PI / 2 - 0.3);
      this._pseudoClone.quaternion.copy(this._modelClone.quaternion);

      /*
      this._direction = new THREE.Vector3(
        this._user.directionX,
        this._user.directionY,
        this._user.directionZ,
      );
      if (this._direction.y > 0)
        this._modelClone.rotation.y =
          2 * Math.atan2(this._user.directionX, this._user.directionY);
      else if (this._direction.y <= 0)
        this._modelClone.rotation.y =
          -2 * Math.atan2(this._user.directionX, this._user.directionY); */

      this._scaleClone = self.scene.getObjectByProperty(
        'uuid',
        user.scale,
      ) as Mesh;
      if (this._scaleClone) {
        this._scaleClone.setRotationFromMatrix(self.camera.matrix);
        this._scaleClone.position.set(
          this._modelClone.position.x,
          this._modelClone.position.y -
            DESIGN.GAMEPLAY.PLAYER_HEIGHT / 2 +
            (!this._isHide ? 3.25 : 2.5),
          this._modelClone.position.z,
        );
      }
      this._scaleClone.scale.set(
        this._user.health / 100,
        1,
        this._user.health / 100,
      );

      this._name = user.text;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._name.setRotationFromMatrix(self.camera.matrix);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._name.position.x = this._modelClone.position.x;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._name.position.y =
        this._modelClone.position.y +
        DESIGN.GAMEPLAY.PLAYER_HEIGHT +
        (user.animation === 'dead' ? -1 : !this._isHide ? 0.75 : 0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._name.position.z = this._modelClone.position.z;

      this._weaponClone = self.scene.getObjectByProperty(
        'uuid',
        user.weapon,
      ) as Group;
      if (this._weaponClone) {
        this._weaponClone.position.set(
          this._modelClone.position.x,
          this._modelClone.position.y + 1.3,
          this._modelClone.position.z,
        );
        this._weaponClone.quaternion.copy(this._modelClone.quaternion);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this._animation = user.nextAction['_clip'].name;

        if (this._animation === 'firestand')
          this._weaponClone.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -1.7);
        else if (
          !this._animation.includes('hide') &&
          (this._isForward || this._isBackward)
        )
          this._weaponClone.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -1.7);
        else
          this._weaponClone.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -1.3);

        if (this._animation === 'jump') {
          this._weaponClone.position
            .add(
              self.helper
                .getForwardVectorFromObject(this._modelClone)
                .multiplyScalar(-0.2),
            )
            .add(
              self.helper
                .getSideVectorFromObject(this._weaponClone)
                .multiplyScalar(-0.35),
            );
          this._weaponClone.position.y += 0.8;
        } else if (this._animation === 'stand') {
          this._weaponClone.position.add(
            self.helper
              .getSideVectorFromObject(this._weaponClone)
              .multiplyScalar(-0.1),
          );
        } else if (this._animation.includes('hide')) {
          if (this._animation === 'hide' || this._animation === 'firehide') {
            this._weaponClone.position.add(
              self.helper
                .getForwardVectorFromObject(this._modelClone)
                .multiplyScalar(this._animation === 'firehide' ? 0.45 : 0.3),
            );
            this._weaponClone.position.y +=
              this._animation === 'firehide' ? 0.225 : 0.15;
          } else {
            if (this._isForward) {
              this._weaponClone.position
                .add(
                  self.helper
                    .getForwardVectorFromObject(this._weaponClone)
                    .multiplyScalar(-0.1),
                )
                .add(
                  self.helper
                    .getSideVectorFromObject(this._weaponClone)
                    .multiplyScalar(-0.5),
                );
            } else {
              this._weaponClone.position
                .add(
                  self.helper
                    .getForwardVectorFromObject(this._modelClone)
                    .multiplyScalar(
                      this._animation.includes('left') ? 0.4 : 0.5,
                    ),
                )
                .add(
                  self.helper
                    .getSideVectorFromObject(this._modelClone)
                    .multiplyScalar(-0.3),
                );
            }
            if (this._isForward) this._weaponClone.position.y += 0.5;
            else if (this._isBackward) this._weaponClone.position.y += 0.45;
            else this._weaponClone.position.y += 0.4;
          }
          this._weaponClone.position.y -= 0.5;
        } else {
          if (
            this._animation.includes('fire') ||
            (this._animation === 'firestand' && user.fireTimer)
          ) {
            this._weaponClone.position
              .add(
                self.helper
                  .getForwardVectorFromObject(this._modelClone)
                  .multiplyScalar(0.1),
              )
              .add(
                self.helper
                  .getSideVectorFromObject(this._modelClone)
                  .multiplyScalar(-0.1),
              );
            this._weaponClone.position.y += 0.25;
          } else {
            this._weaponClone.position
              .add(
                self.helper
                  .getForwardVectorFromObject(this._weaponClone)
                  .multiplyScalar(this._isBackward ? 0 : 0.2),
              )
              .add(
                self.helper
                  .getSideVectorFromObject(this._weaponClone)
                  .multiplyScalar(
                    this._isForward || this._isBackward ? -0.2 : -0.4,
                  ),
              );
            this._weaponClone.position.y +=
              this._animation === 'run'
                ? 0.15
                : this._isForward
                ? 0.225
                : this._isBackward
                ? 0.2
                : this._animation.includes('fire')
                ? 0.25
                : 0.05;
          }
        }
      }
    }
  }

  private _getMove(mixer: AnimationMixer): AnimationAction {
    if (this._isHide) {
      if (this._isForward) {
        if (this._isFire)
          return this._getAnimation(mixer, Animations.firehideforward);
        else return this._getAnimation(mixer, Animations.hideforward);
      } else if (this._isBackward)
        return this._getAnimation(mixer, Animations.hideback);
      else if (this._isLeft)
        return this._getAnimation(mixer, Animations.hideleft);
      else if (this._isRight)
        return this._getAnimation(mixer, Animations.hideright);
      if (this._isFire) return this._getAnimation(mixer, Animations.firehide);
      else return this._getAnimation(mixer, Animations.hide);
    } else {
      if (this._isForward) {
        if (this._isFire)
          return this._getAnimation(mixer, Animations.firestandforward);
        else return this._getAnimation(mixer, Animations.standforward);
      } else if (this._isBackward)
        return this._getAnimation(mixer, Animations.standback);
      else if (this._isLeft)
        return this._getAnimation(mixer, Animations.standleft);
      else if (this._isRight)
        return this._getAnimation(mixer, Animations.standright);
    }
    if (this._isFire) return this._getAnimation(mixer, Animations.firestand);
    return this._getAnimation(mixer, Animations.stand);
  }

  private _getAnimation(
    mixer: AnimationMixer,
    name: Animations,
    isStart = false,
  ): AnimationAction {
    switch (name) {
      case Animations.dead:
        this._action = mixer.clipAction(this._gltf.animations[0]);
        this._action.setLoop(THREE.LoopOnce, 1);
        this._action.clampWhenFinished = true;
        if (isStart) this._action.setDuration(0);
        return this._action;
      case Animations.hide:
        return mixer.clipAction(this._gltf.animations[5]);
      case Animations.hideback:
        return mixer.clipAction(this._gltf.animations[6]);
      case Animations.hideleft:
        return mixer.clipAction(this._gltf.animations[8]);
      case Animations.hideright:
        return mixer.clipAction(this._gltf.animations[9]);
      case Animations.hideforward:
        return mixer.clipAction(this._gltf.animations[7]);
      case Animations.hit:
        return mixer.clipAction(this._gltf.animations[10]);
      case Animations.stand:
        return mixer.clipAction(this._gltf.animations[13]);
      case Animations.standforward:
        return mixer.clipAction(this._gltf.animations[15]);
      case Animations.standback:
        return mixer.clipAction(this._gltf.animations[14]);
      case Animations.standleft:
        return mixer.clipAction(this._gltf.animations[16]);
      case Animations.standright:
        return mixer.clipAction(this._gltf.animations[17]);
      case Animations.jump:
        this._action = mixer.clipAction(this._gltf.animations[11]);
        this._action.setLoop(THREE.LoopOnce, 1);
        this._action.clampWhenFinished = true;
        this._action.setDuration(3);
        return this._action;
      case Animations.run:
        return mixer.clipAction(this._gltf.animations[12]);
      case Animations.firestand:
        return mixer.clipAction(this._gltf.animations[3]);
      case Animations.firestandforward:
        return mixer.clipAction(this._gltf.animations[4]);
      case Animations.firehide:
        return mixer.clipAction(this._gltf.animations[1]);
      case Animations.firehideforward:
        return mixer.clipAction(this._gltf.animations[2]);
    }
    return mixer.clipAction(this._gltf.animations[13]);
  }
}
