import * as THREE from 'three';

// Types
import type { ISelf } from '@/models/modules';
import type { IObjectThree } from '@/models/api';
import type { Mesh } from 'three';

// Constants
import { Textures } from '@/utils/constants';

export default class Clouds {
  private _list: IObjectThree[];
  private _counter = 0;
  private _cloud: Mesh;
  private _cloudClone: Mesh;
  private _number: number;

  constructor() {
    this._list = [];
    this._cloud = new THREE.Mesh();
    this._cloudClone = new THREE.Mesh();
    this._number = 0;
  }

  public init(self: ISelf): void {
    this._cloud = new THREE.Mesh(
      new THREE.SphereBufferGeometry(2, 8, 8),
      self.assets.getMaterial(Textures.glassspecial),
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._cloud.material.opacity = 0.1;

    while (this._counter < 33) {
      this.addCloud(self);
    }
  }

  public addCloud(self: ISelf): void {
    ++this._counter;
    this._cloudClone = this._cloud.clone();

    this._cloudClone.position.set(self.helper.randomInteger(-500, 500), self.helper.randomInteger(40, 120), self.helper.randomInteger(-500, 500));

    this._number = (Math.random() + 1) * self.helper.randomInteger(3, 9);
    this._cloudClone.scale.set(this._number, this._number, this._number * self.helper.randomInteger(2, 5));

    this._list.push({
      id: this._counter,
      mesh: this._cloudClone.uuid,
    });
    self.scene.add(this._cloudClone);
  }

  private _redrawCloud(self: ISelf, cloud: IObjectThree): void {
    this._cloudClone = self.scene.getObjectByProperty(
      'uuid',
      cloud.mesh,
    ) as Mesh;
    if (this._cloudClone) {
      this._cloudClone.position.z -= self.events.delta * 20;

      this._cloudClone.rotateZ(self.events.delta * -1);

      if (this._cloudClone.position.z < -500) {
        this._cloudClone.position.z = 500;
        this._cloudClone.position.x = self.helper.randomInteger(-500, 500);
      }
    }
  }

  public animate(self: ISelf): void {
    // console.log('Zones animate', this._list.length);
    this._list.forEach((cloud: IObjectThree) => {
      this._redrawCloud(self, cloud);
    });
  }
}
