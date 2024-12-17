import * as THREE from 'three';

// Types
import type { ISelf } from '@/models/modules';
import type { ILightThree } from '@/models/api';

// Constants
import {
  Textures,
  Audios,
  Races,
} from '@/utils/constants';

export default class Shots {
  private _list: ILightThree[];
  private _listNew: ILightThree[];
  private _lightItem!: ILightThree;
  private _ids: number[];
  private _light!: THREE.Mesh;
  private _magik!: THREE.Mesh;
  private _lightClone!: THREE.Mesh;
  private _target!: THREE.Vector3;
  private _is = false;
  private _time = 0;
  private _speed!: number;
  private _distance!: number;
  private _sound!: THREE.Mesh;
  private _soundClone!: THREE.Mesh;
  private _config: {[key: string]: any};

  constructor() {
    this._list = [];
    this._listNew = [];
    this._ids = [];
    this._target = new THREE.Vector3();
    this._config = {};
  }

  public init(self: ISelf): void {
    this._config = self.store.getters['persist/config'].races;

    this._light = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 8, 8),
      self.assets.getMaterial(Textures.fire),
    );
    this._magik = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 8, 8),
      self.assets.getMaterial(Textures.purple),
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._light.material.opacity = 0.7;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._magik.material.opacity = 0.7;

    this._sound = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      self.assets.getMaterial(Textures.hole),
    );
    this._sound.visible = false;
  }

  public animate(self: ISelf): void {
    if (
      self.store.getters['api/game'] &&
      self.store.getters['api/game'].weapon &&
      self.store.getters['api/game'].weapon.lights &&
      (self.store.getters['api/game'].weapon.lights.length || this._list.length)
    ) {
      this._is = false;
      this._time += self.events.delta;
      if (this._time > 1) {
        this._is = true;
        this._time = 0;
      }

      this._listNew = self.store.getters['api/game'].weapon.lights;
      if (this._is) this._ids = [];
      this._listNew.forEach((light) => {
        if (this._is) this._ids.push(light.id as number);
        this._lightItem = this._list.find(
          (item) => item.id === light.id,
        ) as ILightThree;
        if (this._lightItem && this._lightItem.model) {
          this._lightClone = self.scene.getObjectByProperty(
            'uuid',
            this._lightItem.model as string,
          ) as THREE.Mesh;
          if (this._lightClone) {
            this._target.set(light.positionX, light.positionY, light.positionZ);
            this._distance = this._target.distanceTo(this._lightClone.position);
            this._speed = self.events.delta * this._distance * 2;

            if (
              !this._lightClone.visible &&
              this._lightClone.position.distanceTo(this._target) >
                Math.sqrt(
                  Math.pow(this._config[light.race].box.x, 2) +
                    Math.pow(this._config[light.race].box.z, 2),
                ) *
                  2
            )
              this._lightClone.visible = true;

            if (
              this._lightClone.position.x <
              this._target.x - this._speed * 1.1
            )
              this._lightClone.position.x += this._speed;
            else if (
              this._lightClone.position.x >
              this._target.x + this._speed * 1.1
            )
              this._lightClone.position.x -= this._speed;
            else this._lightClone.position.x = this._target.x;

            if (
              this._lightClone.position.y <
              this._target.y - this._speed * 1.1
            )
              this._lightClone.position.y += this._speed;
            else if (
              this._lightClone.position.y >
              this._target.y + this._speed * 1.1
            )
              this._lightClone.position.y -= this._speed;
            else this._lightClone.position.y = this._target.y;

            if (
              this._lightClone.position.z <
              this._target.z - this._speed * 1.1
            )
              this._lightClone.position.z += this._speed;
            else if (
              this._lightClone.position.z >
              this._target.z + this._speed * 1.1
            )
              this._lightClone.position.z -= this._speed;
            else this._lightClone.position.z = this._target.z;
          }

          this._lightClone.rotateX(self.events.delta * -3);
          this._lightClone.rotateY(self.events.delta * -3);
          this._lightClone.rotateZ(self.events.delta * -3);
        } else {
          if (
            new THREE.Vector3(
              light.positionX,
              light.positionY,
              light.positionZ,
            ).distanceTo(
              new THREE.Vector3(
                self.camera.position.x,
                self.camera.position.y,
                self.camera.position.z,
              ),
            ) < 100
          ) {
            if (light.race === Races.soldier || light.race === Races.cyborg)
              this._lightClone = this._light.clone();
            else this._lightClone = this._magik.clone();

            this._lightClone.position.set(
              light.positionX,
              light.positionY,
              light.positionZ,
            );
            this._lightClone.visible = false;
            if (light.race !== Races.cyborg && light.race !== Races.soldier)
              this._lightClone.scale.set(
                this._config[light.race].box.y / 2,
                this._config[light.race].box.y / 2,
                this._config[light.race].box.y / 2,
              );

            this._soundClone = this._sound.clone();
            self.scene.add(this._soundClone);
            self.audio.addAndPlayAudioOnObject(
              self,
              this._soundClone.uuid,
              Audios.light,
            );

            this._list.push({
              ...light,
              model: this._lightClone.uuid,
              sound: this._soundClone.uuid,
              start: this._lightClone.position,
            });
            self.scene.add(this._lightClone);
          }
        }
      });

      if (this._is) {
        this._listNew = this._list.filter(
          (light) => !this._ids.includes(light.id as number),
        );
        this._listNew.forEach((light) => {
          this._lightClone = self.scene.getObjectByProperty(
            'uuid',
            light.model as string,
          ) as THREE.Mesh;
          if (this._lightClone) this._lightClone.removeFromParent();

          this._soundClone = self.scene.getObjectByProperty(
            'uuid',
            light.sound as string,
          ) as THREE.Mesh;
          if (this._soundClone) this._soundClone.removeFromParent();
        });
        this._list = this._list.filter((light) =>
          this._ids.includes(light.id as number),
        );
      }
    }
  }
}
