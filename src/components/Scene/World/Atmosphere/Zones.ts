import * as THREE from 'three';

// Types
import type { ISelf } from '@/models/modules';
import type { IZoneThree, IZone } from '@/models/api';
import type { Mesh } from 'three';

// Constants
import { Textures } from '@/utils/constants';
import { TPosition } from '@/models/utils';

export default class Zones {
  private _list: IZoneThree[];
  private _counter = 0;
  private _blood: Mesh;
  private _blood2: Mesh;
  private _blood3: Mesh;
  private _bloodClone: Mesh;
  private _bloodClone2: Mesh;
  private _number!: number;
  private _config: IZone[];
  private _array: IZone[];
  private _zone!: IZone;
  private _position!: TPosition;

  constructor(config: IZone[]) {
    this._config = config;
    this._list = [];
    this._array = [];
    this._blood = new THREE.Mesh();
    this._blood2 = new THREE.Mesh();
    this._blood3 = new THREE.Mesh();
    this._bloodClone = new THREE.Mesh();
    this._bloodClone2 = new THREE.Mesh();
  }

  public init(self: ISelf): void {
    this._blood = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 8, 8),
      self.assets.getMaterial(Textures.purple),
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._blood.material.opacity = 0.75;
    this._blood2 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 8, 8),
      self.assets.getMaterial(Textures.purple),
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._blood2.material.opacity = 0.5;
    this._blood3 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 8, 8),
      self.assets.getMaterial(Textures.purple),
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._blood3.material.opacity = 0.25;
  }

  public blood(self: ISelf): void {
    this._array = this._config.filter(
      (zone) =>
        new THREE.Vector2(zone.x, zone.z).distanceTo(
          new THREE.Vector2(self.camera.position.x, self.camera.position.z),
        ) < 100,
    );
    if (this._array.length) {
      this._number = self.helper.randomInteger(0, this._array.length - 1);
      this._zone = this._array[this._number];

      this._position = self.helper.getRandomPosition(
        this._zone.x,
        this._zone.z,
        this._zone.radius / 3,
        false,
      );

      ++this._counter;

      this._bloodClone = this._blood.clone();
      this._bloodClone.position.set(this._position.x, 2, this._position.z);

      this._number = (Math.random() + 0.5) * self.helper.randomInteger(1, 3);
      this._bloodClone.scale.set(this._number, this._number, this._number);

      this._list.push({
        id: this._counter,
        mesh: this._bloodClone.uuid,
        is2: false,
        is3: false,
      });
      self.scene.add(this._bloodClone);
    }
  }

  private _redrawBlood(self: ISelf, blood: IZoneThree): void {
    this._bloodClone = self.scene.getObjectByProperty(
      'uuid',
      blood.mesh,
    ) as Mesh;
    if (this._bloodClone) {
      this._bloodClone.position.y += self.events.delta * 25;

      this._bloodClone.rotateX(self.events.delta * -3);
      this._bloodClone.rotateY(self.events.delta * -3);
      this._bloodClone.rotateZ(self.events.delta * -3);

      if (this._bloodClone.position.y >= 20 && !blood.is2) {
        this._bloodClone2 = this._blood2.clone();
        this._bloodClone2.position.copy(this._bloodClone.position);
        this._bloodClone2.scale.copy(this._bloodClone.scale);
  
        this._bloodClone.removeFromParent();
        self.scene.add(this._bloodClone2);
        
        blood.mesh = this._bloodClone2.uuid;
        blood.is2 = true;
      }

      if (this._bloodClone.position.y >= 40 && !blood.is3) {
        this._bloodClone2 = this._blood3.clone();
        this._bloodClone2.position.copy(this._bloodClone.position);
        this._bloodClone2.scale.copy(this._bloodClone.scale);
  
        this._bloodClone.removeFromParent();
        self.scene.add(this._bloodClone2);

        blood.mesh = this._bloodClone2.uuid;
        blood.is3 = true;
      }

      if (this._bloodClone.position.y > 60) {
        this._list = this._list.filter((item) => item.id !== blood.id);
        this._bloodClone.removeFromParent();
      }
    }
  }

  public animate(self: ISelf): void {
    // console.log('Zones animate', this._list.length);
    this._list.forEach((blood: IZoneThree) => {
      this._redrawBlood(self, blood);
    });
  }
}
