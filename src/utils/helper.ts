// Modules Helper
/////////////////////////////////////////////

import * as THREE from 'three';

// Constants
import { Names, Textures, Audios } from '@/utils/constants';

// Types
import type {
  Texture,
  MeshStandardMaterial,
  PlaneBufferGeometry,
  BoxGeometry,
  ConeGeometry,
  Vector3,
  Object3D,
} from 'three';
import type { Store } from 'vuex';
import type { State } from '@/store';
import type { ISelf } from '@/models/modules';
import type { TPosition, TPositions } from '@/models/utils';

export default class Helper {
  // Private working variables
  private _number = 0;
  private _string = '';
  private _direction: Vector3;

  // Loaders
  public textureLoader: THREE.TextureLoader;

  // Utils
  public material: MeshStandardMaterial = new THREE.MeshStandardMaterial();
  public map!: Texture;
  public geometry!: PlaneBufferGeometry | BoxGeometry | ConeGeometry;

  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this._direction = new THREE.Vector3();
  }

  // Math
  ///////////////////////////////////////////////////////////

  public randomInteger(min: number, max: number): number {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  public yesOrNo(): boolean {
    return Math.random() >= 0.5;
  }

  public plusOrMinus(): number {
    return Math.random() >= 0.5 ? 1 : -1;
  }

  public distance2D(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  public degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  public radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  public damping(delta: number): number {
    return Math.exp(-3 * delta) - 1;
  }

  public getRandomPosition(
    centerX: number,
    centerZ: number,
    radius: number,
    isSafeCenter: boolean,
  ): TPosition {
    const safe = isSafeCenter ? 16 : 8;
    const a = this.plusOrMinus();
    const b = this.plusOrMinus();
    return {
      x: Math.round(centerX + Math.random() * a * radius) + safe * a,
      z: Math.round(centerZ + Math.random() * b * radius) + safe * b,
    };
  }

  private _isBadPosition(
    positions: TPositions,
    position: TPosition,
    distance: number,
  ): boolean {
    return !!positions.find(
      (place: TPosition) =>
        this.distance2D(place.x, place.z, position.x, position.z) < distance,
    );
  }

  public getUniqueRandomPosition(
    positions: TPositions,
    centerX: number,
    centerZ: number,
    distance: number,
    radius: number,
    isSafeCenter: boolean,
  ): TPosition {
    let position: TPosition = this.getRandomPosition(
      centerX,
      centerZ,
      radius,
      isSafeCenter,
    );
    while (this._isBadPosition(positions, position, distance)) {
      position = this.getRandomPosition(centerX, centerZ, radius, isSafeCenter);
    }
    return position;
  }

  public getUnixtime(date?: Date): number {
    if (date) return Math.round(date.getTime() / 1000.0);
    return Math.round(new Date().getTime() / 1000.0);
  }

  // Utils

  public getForwardVector(self: ISelf): Vector3 {
    self.camera.getWorldDirection(this._direction);
    this._direction.y = 0;
    this._direction.normalize();

    return this._direction;
  }

  public getSideVector(self: ISelf): Vector3 {
    self.camera.getWorldDirection(this._direction);
    this._direction.y = 0;
    this._direction.normalize();
    this._direction.cross(self.camera.up);

    return this._direction;
  }

  public getForwardVectorFromObject(obj: Object3D): Vector3 {
    obj.getWorldDirection(this._direction);
    this._direction.y = 0;
    this._direction.normalize();

    return this._direction;
  }

  public getSideVectorFromObject(obj: Object3D): Vector3 {
    obj.getWorldDirection(this._direction);
    this._direction.y = 0;
    this._direction.normalize();
    this._direction.cross(obj.up);

    return this._direction;
  }

  // Loading helpers
  ///////////////////////////////////////////////////////////

  // Помощник загрузки текстур
  public textureLoaderHelper(self: ISelf, name: Textures): Texture {
    return this.textureLoader.load(
      `./images/textures/material/${name}.jpg`,
      (map: Texture) => {
        this._number = self.assets.getRepeatByName(name);
        map.repeat.set(this._number, this._number);
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.encoding = THREE.sRGBEncoding;

        self.render();
        this.loaderDispatchHelper(self.store, name);

        return map;
      },
    );
  }

  // Помощник прелодера
  public loaderDispatchHelper(
    store: Store<State>,
    name: Names | Textures | Audios,
    isBuild = false,
  ): void {
    this._string = isBuild ? `${name}IsBuild` : `${name}IsLoaded`;
    store
      .dispatch('preloader/preloadOrBuilt', this._string)
      .then(() => {
        store.dispatch('preloader/isAllLoadedAndBuild');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Помощник прелодера локации
  public loaderLocationDispatchHelper(
    store: Store<State>,
    name: Names | Textures,
    isBuild = false,
  ): void {
    this._string = isBuild ? `${name}IsBuild` : `${name}IsLoaded`;
    store
      .dispatch('location/preloadOrBuilt', this._string)
      .then(() => {
        store.dispatch('location/isAllLoadedAndBuild');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Помощник загрузки звуков
  public setAudioToHeroHelper(
    self: ISelf,
    name: Audios,
    buffer?: AudioBuffer,
  ): void {
    if (buffer) self.audio.addAudioToHero(self, buffer, name);
    else {
      self.assets.audioLoader.load(`./audio/${name}.mp3`, (buffer) => {
        self.audio.addAudioToHero(self, buffer, name);
        this.loaderDispatchHelper(self.store, name);

        // Ветер
        if (name === Audios.wind) self.audio.startHeroSound(Audios.wind);
      });
    }
  }
}
