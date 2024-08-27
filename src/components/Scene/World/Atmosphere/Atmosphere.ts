// Types
import * as THREE from 'three';

import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  SphereBufferGeometry,
  Texture,
} from 'three';
import type { ISelf } from '@/models/modules';
import type {
  ILocation,
  ITree,
  IStone,
  IGrass,
  IBuild,
  ITreeScene,
  IGrassScene,
} from '@/models/api';
import type { Doors } from '@/models/utils';

// Constants
import { EmitterEvents } from '@/models/api';
import { Audios, Colors, Names, Textures, DESIGN, Races } from '@/utils/constants';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Services
import emitter from '@/utils/emitter';

export default class Atmosphere {
  public name = Names.atmosphere;
  public world!: Mesh[];
  public doors!: Mesh[];
  public point!: Mesh;

  private _status!: Races.human | Races.reptiloid | null;
  private _isStatus!: boolean; 
  private _redFlag!: Mesh[];
  private _blueFlag!: Mesh[];
  private _doorsStore!: Mesh[];
  private _bus!: Doors[];
  private _light!: HemisphereLight;
  private _sun!: DirectionalLight;
  private _skyGeometry!: SphereBufferGeometry;
  private _sky!: Mesh;
  private _mesh!: Mesh;
  private _mesh2!: Mesh;
  private _model!: Group;
  private _model2!: Group;
  private _modelClone!: Group;
  private _modelClone2!: Group;
  private _trees: ITreeScene[] = [];
  private _grasses: IGrassScene[] = [];
  private _ambient!: AmbientLight;
  private _index!: number;
  private _time = 0;
  private _randomX!: number;
  private _randomY!: number;
  private _randomZ!: number;
  private _rotateX = 0;
  private _rotateY = 0;
  private _rotateZ = 0;
  private _direction = 1;
  private _isFirst = false;
  private _location!: ILocation;
  private _number!: number;
  private _number2!: number;
  private _pseudo!: Mesh;
  private _pseudoClone!: Mesh;
  private _color!: Colors;

  // Освещение - "время суток"
  private _DAY = [
    {
      ambient: 0xf885a6,
      fog: 0xc43b9f,
      intensity: 0.5,
      sun: 0.6,
      mode: 'day',
    },
    {
      ambient: 0xf554e9,
      fog: 0xd35cbc,
      intensity: 0.6,
      sun: 0.725,
      mode: 'day',
    },
    {
      ambient: 0xf99c7b,
      fog: 0xea8395,
      intensity: 0.7,
      sun: 0.85,
      mode: 'day',
    },
    {
      ambient: 0xffffff,
      fog: 0xffffff,
      intensity: 0.8,
      sun: 1,
      mode: 'day',
    },
    {
      ambient: 0xb2c5cc,
      fog: 0x92cbd2,
      intensity: 0.7,
      sun: 0.9,
      mode: 'day',
    },
    {
      ambient: 0x8492a7,
      fog: 0x688ec5,
      intensity: 0.6,
      sun: 0.6,
      mode: 'day',
    },
    {
      ambient: 0x57618f,
      fog: 0x414cb1,
      intensity: 0.5,
      sun: 0.5,
      mode: 'day',
    },
    {
      ambient: 0x2902ad,
      fog: 0x4338c7,
      intensity: 0.4,
      sun: 0.4,
      mode: 'night',
    },
    {
      ambient: 0x3b5696,
      fog: 0x428797,
      intensity: 0.3,
      sun: 0.3,
      mode: 'night',
    },
    {
      ambient: 0x356c7a,
      fog: 0x2ca085,
      intensity: 0.15,
      sun: 0.15,
      mode: 'night',
    },
    {
      ambient: 0x42606d,
      fog: 0x25572d,
      intensity: 0.05,
      sun: 0.05,
      mode: 'night',
    },
    {
      ambient: 0x222222,
      fog: 0x111111,
      intensity: 0.03,
      sun: 0.03,
      mode: 'night',
    },
    {
      ambient: 0x6b6211,
      fog: 0x62391c,
      intensity: 0.5,
      sun: 0.1,
      mode: 'night',
    },
    {
      ambient: 0xac560c,
      fog: 0xfa6e05,
      intensity: 0.2,
      sun: 0.25,
      mode: 'night',
    },
    {
      ambient: 0xf65552,
      fog: 0xe04b44,
      intensity: 0.3,
      sun: 0.4,
      mode: 'night',
    },
    {
      ambient: 0xf00f42,
      fog: 0xdc234d,
      intensity: 0.4,
      sun: 0.5,
      mode: 'day',
    },
  ];

  public init(self: ISelf): void {
    this._index = self.store.getters['persist/day'];
    this._location = self.store.getters['api/locationData'];
    this.world = [];
    this.doors = [];
    this._doorsStore = [];
    this._redFlag = [];
    this._blueFlag = [];
    this._isStatus = false;
    this._bus = [];

    // console.log('Atmosphere init: ', this._location);

    self.store.dispatch('persist/setPersistState', {
      field: 'day',
      value: this._index === this._DAY.length - 1 ? 0 : this._index + 1,
    });

    // Lights

    // Ambient
    this._ambient = new THREE.AmbientLight(this._DAY[this._index].ambient);
    self.scene.add(this._ambient);

    // Hemisphere
    this._light = new THREE.HemisphereLight(
      self.scene.background as Color,
      0xd52a9e,
      this._DAY[this._index].intensity,
    );
    this._light.position.set(0, DESIGN.SIZE * 2, 0).normalize();
    self.scene.add(this._light);

    // Fog
    self.scene.fog = new THREE.Fog(
      this._DAY[this._index].fog,
      DESIGN.SIZE / 20,
      DESIGN.SIZE * 3,
    );

    // Sun
    this._sun = new THREE.DirectionalLight(
      Colors.sun,
      this._DAY[this._index].sun,
    );
    this._sun.position.x = 0;
    this._sun.position.z = 0;
    this._sun.position.y = DESIGN.SIZE * 2;
    this._sun.castShadow = true;

    this._sun.shadow.mapSize.width = 2048;
    this._sun.shadow.mapSize.height = 2048;

    this._sun.shadow.camera.left = -200;
    this._sun.shadow.camera.right = 200;
    this._sun.shadow.camera.top = 200;
    this._sun.shadow.camera.bottom = -200;

    this._sun.shadow.camera.far = 3500;
    this._sun.shadow.camera.near = 1;
    this._sun.shadow.bias = -0.0001;

    self.scene.add(this._sun);

    // Sky
    const folder = this._DAY[this._index].mode === 'day' ? 'day' : 'night';
    this._number = self.helper.randomInteger(1, 5);
    self.assets.textureLoader.load(
      `./images/textures/${folder}/${folder + this._number}.jpg`,
      (map: Texture) => {
        self.helper.loaderLocationDispatchHelper(self.store, Textures.sky);

        this._number = self.assets.getRepeatByName(Textures.sky);
        map.repeat.set(this._number, this._number);
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.encoding = THREE.sRGBEncoding;

        this._skyGeometry = new THREE.SphereBufferGeometry(
          DESIGN.SIZE * 2,
          64,
          64,
        );
        // invert the geometry on the x-axis so that all of the faces point inward
        this._skyGeometry.scale(-1, 1, 1);
        this._sky = new THREE.Mesh(
          this._skyGeometry,
          new THREE.MeshStandardMaterial({
            map,
            color: Colors.sky,
          }),
        );

        this._sky.rotateX(Math.PI / 4);
        this._sky.rotateY(Math.PI / 6);
        this._sky.rotateZ(Math.PI / 3);

        self.scene.add(this._sky);

        self.helper.loaderLocationDispatchHelper(
          self.store,
          Textures.sky,
          true,
        );
      },
    );

    // Ground
    self.assets.textureLoader.load(
      `./images/textures/ground/${this._location.ground}.jpg`,
      (map: Texture) => {
        self.helper.loaderLocationDispatchHelper(self.store, Textures.ground);

        this._number = self.assets.getRepeatByName(Textures.ground);
        map.repeat.set(this._number, this._number);
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.encoding = THREE.sRGBEncoding;

        // Ground 1

        if (this._location.x < -1 && this._location.y > 1) {
          this._color = Colors.white;
        } else if (this._location.x < -1 && this._location.y < -1) {
          this._color = Colors.yellowDark;
        }

        this._mesh = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(
            DESIGN.SIZE * 2,
            DESIGN.SIZE * 2,
            32,
            32,
          ),
          new THREE.MeshStandardMaterial({
            map,
            color: Colors.yellowDark,
          }),
        );
        this._mesh.rotation.x = -Math.PI / 2;
        this._mesh.position.set(0, -1, 0);
        this._mesh.receiveShadow = true;

        self.scene.add(this._mesh);

        // Ground 2

        self.helper.geometry = new THREE.PlaneBufferGeometry(
          DESIGN.SIZE * 4,
          DESIGN.SIZE * 4,
          32,
          32,
        );

        // Искажение
        const vertex = new THREE.Vector3();
        const { position } = self.helper.geometry.attributes;
        for (let i = 0, l = position.count; i < l; i++) {
          vertex.fromBufferAttribute(position, i);

          if (
            self.helper.distance2D(0, 0, vertex.x, vertex.y) >
              DESIGN.SIZE * 1 &&
            self.helper.distance2D(0, 0, vertex.x, vertex.y) < DESIGN.SIZE * 2
          ) {
            vertex.x += Math.random() * self.helper.plusOrMinus() * 2;
            vertex.y += Math.random() * self.helper.plusOrMinus() * 2;
            vertex.z += Math.random() * self.helper.plusOrMinus() * 2;
            vertex.z *= Math.random() * 10;
          }

          position.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }

        this._mesh2 = new THREE.Mesh(
          self.helper.geometry,
          new THREE.MeshStandardMaterial({
            map: map,
            color: this._DAY[this._index].ambient,
          }),
        );
        this._mesh2.rotation.x = -Math.PI / 2;
        this._mesh2.position.set(0, -1.1, 0);
        this._mesh2.updateMatrix();

        self.scene.add(this._mesh2);

        self.render();

        self.helper.loaderLocationDispatchHelper(
          self.store,
          Textures.ground,
          true,
        );
      },
    );

    // Points
    self.assets.GLTFLoader.load('./images/models/point.glb', (model: GLTF) => {
      self.helper.loaderLocationDispatchHelper(self.store, Names.points);
      this._model = self.assets.traverseHelper(self, model).scene;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._model.traverse((child: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (child.isMesh) {
          child.castShadow = true;
          if (child.name.includes('door')) {
            child.position.y = 1.75;
            this.doors.push(child);
            this._doorsStore.push(child);
          } else if (child.name.includes('player')) {
            if (child.name.includes('red')) this._redFlag.push(child);
            else if (child.name.includes('blue')) this._blueFlag.push(child);
            child.visible = false;
            this.world.push(child);
          } else {
            this.world.push(child);
          }
        }
      });

      this._pseudo = new THREE.Mesh(
        new THREE.BoxBufferGeometry(2, 10, 2),
        self.assets.getMaterial(Textures.pseudo),
      );
      this._pseudo.position.y = 4;
      this._pseudo.name = Names.points;
      this._pseudo.visible = false;
      self.scene.add(this._pseudo);
      this.point = this._pseudo;

      self.helper.loaderLocationDispatchHelper(
        self.store,
        'points' as Names,
        true,
      );
    });

    // Trees
    self.assets.GLTFLoader.load('./images/models/tree.glb', (model: GLTF) => {
      self.helper.loaderLocationDispatchHelper(self.store, Names.trees);

      this._model = model.scene;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._model.traverse((child: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
      this._model.castShadow = true;

      this._location.trees.forEach((tree: ITree) => {
        this._modelClone = this._model.clone();
        this._modelClone.position.set(
          tree.x,
          -1 + (-1 * tree.scale) / 5,
          tree.z,
        );
        this._modelClone.scale.set(tree.scale, tree.scale, tree.scale);
        this._modelClone.rotateX(self.helper.degreesToRadians(tree.rotateX));
        this._modelClone.rotateY(self.helper.degreesToRadians(tree.rotateY));
        this._modelClone.rotateZ(self.helper.degreesToRadians(tree.rotateZ));

        this._trees.push({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          model: this._modelClone,
          rotate: 1,
        });
        self.scene.add(this._modelClone);
      });
      this._setRandom(self);

      self.helper.loaderLocationDispatchHelper(self.store, Names.trees, true);
    });

    // Grass
    self.assets.GLTFLoader.load('./images/models/grass.glb', (model: GLTF) => {
      self.helper.loaderLocationDispatchHelper(self.store, Names.grasses);

      this._model = self.assets.traverseHelper(self, model).scene;
      this._model.castShadow = true;
      this._model.rotation.x = -Math.PI / 2;

      this._model2 = this._model.clone();
      this._model2.rotation.z = -Math.PI;

      this._location.grasses.forEach((grass: IGrass) => {
        this._modelClone = this._model.clone();
        this._modelClone2 = this._model2.clone();
        this._modelClone.scale.set(grass.scale, grass.scale, grass.scale);
        this._modelClone2.scale.set(grass.scale, grass.scale, grass.scale);
        this._modelClone.position.set(grass.x, -1 * grass.scale, grass.z);
        this._modelClone2.position.set(grass.x, -1 * grass.scale, grass.z);

        this._grasses.push({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          model: this._modelClone,
          model2: this._modelClone2,
          rotate: 1,
        });
        self.scene.add(this._modelClone);
        self.scene.add(this._modelClone2);
      });
      self.helper.loaderLocationDispatchHelper(self.store, Names.grasses, true);
    });

    // Stones
    self.assets.GLTFLoader.load('./images/models/stones.glb', (model: GLTF) => {
      self.helper.loaderLocationDispatchHelper(self.store, Names.stones);

      if (this._location.x === 0 || this._location.y === 0) {
        this._color = Colors.concrette;
      } else if (this._location.x > 0 && this._location.y < 0) {
        this._color = Colors.stones;
      } else if (this._location.x > 0 && this._location.y > 0) {
        this._color = Colors.stones2;
      } else if (this._location.x < 0 && this._location.y > 0) {
        this._color = Colors.stones4;
      } else if (this._location.x < 0 && this._location.y < 0) {
        this._color = Colors.stones3;
      }

      this._model = model.scene;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._model.traverse((child: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (child.isMesh) {
          if (child.name.includes(Textures.concrette2))
            child.material = self.assets.getMaterialWithColor(
              Textures.concrette2,
              this._color,
            );
        }
      });

      this._pseudo = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4.5, 3.25, 6),
        self.assets.getMaterial(Textures.pseudo),
      );
      this._pseudo.visible = false;

      this._location.stones.forEach((stone: IStone) => {
        this._modelClone = this._model.clone();
        this._modelClone.position.set(
          stone.x,
          -1 * (3 / stone.scaleY) * stone.scaleY - 1,
          stone.z,
        );
        this._modelClone.scale.set(stone.scaleX, stone.scaleY, stone.scaleZ);
        this._modelClone.rotateY(self.helper.degreesToRadians(stone.rotateY));

        self.scene.add(this._modelClone);

        this._pseudoClone = this._pseudo.clone();
        this._number = stone.scaleY < 4 ? 1.3 : stone.scaleY > 6 ? 1.2 : 1.1;
        this._number2 =
          stone.scaleY > 10 ? 0.65 : stone.scaleY > 7 ? 0.75 : 0.85;
        this._pseudoClone.position.set(
          stone.x,
          -1 * (3 / stone.scaleY) * stone.scaleY - 1,
          stone.z,
        );
        this._pseudoClone.scale.set(
          stone.scaleX * this._number,
          stone.scaleY * this._number2,
          stone.scaleZ * this._number,
        );
        this._pseudoClone.rotateY(self.helper.degreesToRadians(stone.rotateY));

        this.world.push(this._pseudoClone);
        self.scene.add(this._pseudoClone);
      });

      self.helper.loaderLocationDispatchHelper(self.store, Names.stones, true);
    });

    // Stones 2
    /*
    self.assets.GLTFLoader.load(
      './images/models/stones2--1.glb',
      (model: GLTF) => {
        self.helper.loaderLocationDispatchHelper(self.store, Names.stones2);

        if (this._location.x === 0 || this._location.y === 0) {
          this._color = Colors.concrette;
        } else if (this._location.x > 0 && this._location.y < 0) {
          this._color = Colors.stones;
        } else if (this._location.x > 0 && this._location.y > 0) {
          this._color = Colors.stones2;
        } else if (this._location.x < 0 && this._location.y > 0) {
          this._color = Colors.stones4;
        } else if (this._location.x < 0 && this._location.y < 0) {
          this._color = Colors.stones3;
        }

        this._model = model.scene;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._model.traverse((child: any) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (child.isMesh) {
            child.material = self.assets.getMaterialWithColor(
              Textures.concrette2,
              this._color,
            );
          }
        });

        this._pseudo = new THREE.Mesh(
          new THREE.BoxBufferGeometry(1, 3, 1),
          self.assets.getMaterial(Textures.pseudo),
        );
        // this._pseudo.visible = false;

        this._location.stones2.forEach((stone: IStone) => {
          this._addStone(self, stone);
        });

        self.helper.loaderLocationDispatchHelper(
          self.store,
          Names.stones2,
          true,
        );
      },
    ); */

    // Builds
    this._location.builds.forEach((build: IBuild) => {
      this._pseudoClone = new THREE.Mesh(
        new THREE.BoxBufferGeometry(build.scale, build.scaleY, build.scale),
        self.assets.getMaterial(Textures.concrette),
      );
      this._pseudoClone.position.set(build.x, build.scaleY * 0.25, build.z);
      this._pseudoClone.rotateZ(self.helper.degreesToRadians(build.rotateZ));
      this._pseudoClone.rotateX(self.helper.degreesToRadians(build.rotateX));
      this._pseudoClone.rotateY(self.helper.degreesToRadians(build.rotateY));

      this.world.push(this._pseudoClone);
      self.scene.add(this._pseudoClone);
    });

    self.helper.loaderLocationDispatchHelper(self.store, this.name, true);
  }

  /*
  private _addStone(self: ISelf, stone: IStone) {
    this._modelClone = this._model.clone();
    this._modelClone.position.set(stone.x, stone.scaleY / -2, stone.z);
    this._modelClone.scale.set(stone.scaleX, stone.scaleY, stone.scaleZ);
    this._modelClone.rotateY(self.helper.degreesToRadians(stone.rotateY));

    self.scene.add(this._modelClone);

    this._pseudoClone = this._pseudo.clone();
    this._pseudoClone.position.set(stone.x, stone.scaleY / 6, stone.z);
    this._pseudoClone.scale.set(
      stone.scaleX * 2,
      stone.scaleY,
      stone.scaleZ * 2,
    );
    this._pseudoClone.rotateY(self.helper.degreesToRadians(stone.rotateY));

    this.world.push(this._pseudoClone);
    self.scene.add(this._pseudoClone);
  } */

  private _setRandom(self: ISelf) {
    this._randomX = self.helper.randomInteger(1, 5);
    this._randomY = self.helper.randomInteger(1, 5);
    this._randomZ = self.helper.randomInteger(1, 5);

    this._trees.forEach((tree) => {
      tree.rotate = self.helper.randomInteger(1, 5);
    });
  }

  private setFlag(self: ISelf) {
    if (this._status === Races.human) {
      this._redFlag.forEach((mesh) => {
        mesh.visible = true;
      });
      this._blueFlag.forEach((mesh) => {
        mesh.visible = false;
      });
    } else if (this._status === Races.reptiloid) {
      this._redFlag.forEach((mesh) => {
        mesh.visible = false;
      });
      this._blueFlag.forEach((mesh) => {
        mesh.visible = true;
      });
    } else {
      this._redFlag.forEach((mesh) => {
        mesh.visible = false;
      });
      this._blueFlag.forEach((mesh) => {
        mesh.visible = false;
      });
    }
  }

  public animate(self: ISelf): void {
    this._time += self.events.delta;

    if (this._sky) this._sky.rotateY(self.events.delta / 25);

    if (!this._isStatus) {
      this._isStatus = true;
      this._status = self.store.getters['api/game'].point.status;
      this.setFlag(self);
    } if (self.store.getters['api/game'].point.status !== this._status) {
      this._status = self.store.getters['api/game'].point.status;
      this.setFlag(self);
    }

    if (this._trees.length) {
      if (this._time > 1) {
        this._direction = this._direction * -1;
        if (!this._isFirst) this._isFirst = true;
        if (this._direction === 1) this._setRandom(self);
        this._time = 0;
      }

      this._trees.forEach((tree) => {
        this._rotateX =
          ((this._randomX * this._direction * (this._isFirst ? 2 : 1)) / 20) *
          self.helper.damping(self.events.delta) *
          tree.rotate;
        this._rotateY =
          ((this._randomY * this._direction * (this._isFirst ? 2 : 1)) / 20) *
          self.helper.damping(self.events.delta) *
          tree.rotate;
        this._rotateZ =
          ((this._randomZ * this._direction * (this._isFirst ? 2 : 1)) / 20) *
          self.helper.damping(self.events.delta) *
          tree.rotate;
        tree.model.rotateX(self.helper.degreesToRadians(this._rotateX));
        tree.model.rotateY(self.helper.degreesToRadians(this._rotateY));
        tree.model.rotateZ(self.helper.degreesToRadians(this._rotateZ));
      });

      this._grasses.forEach((tree) => {
        this._rotateX =
          ((this._randomX * this._direction * (this._isFirst ? 2 : 1)) / 20) *
          self.helper.damping(self.events.delta) *
          tree.rotate;
        this._rotateY =
          ((this._randomY * this._direction * (this._isFirst ? 2 : 1)) / 20) *
          self.helper.damping(self.events.delta) *
          tree.rotate;
        this._rotateZ =
          ((this._randomZ * this._direction * (this._isFirst ? 2 : 1)) / 20) *
          self.helper.damping(self.events.delta) *
          tree.rotate;
        tree.model.rotateX(self.helper.degreesToRadians(this._rotateX / 2));
        tree.model.rotateY(self.helper.degreesToRadians(this._rotateY / 2));
        tree.model.rotateZ(self.helper.degreesToRadians(this._rotateZ / 2));
        tree.model2.rotateX(self.helper.degreesToRadians(this._rotateX / -2));
        tree.model2.rotateY(self.helper.degreesToRadians(this._rotateY / -2));
        tree.model2.rotateZ(self.helper.degreesToRadians(this._rotateZ / -2));
      });
    }

    // Двери
    this._bus.forEach((door) => {
      this._mesh = self.scene.getObjectByProperty(
        'uuid',
        door.id,
      ) as THREE.Mesh;
      if (this._mesh) {
        door.time += self.events.delta;

        // Направление движения
        if (door.isOpen || door.isClose) {
          if (door.isOpen) {
            if (door.direction) this._number = -1;
            else this._number = 1;
          } else if (door.isClose) {
            if (door.direction) this._number = 1;
            else this._number = -1;
          }

          this._mesh.position.y += this._number * self.events.delta * 5;
          door.distance += self.events.delta * 5;
        }

        if (door.isOpen) {
          // Останавливаем дверь
          if (door.distance >= 5) {
            door.isOpen = false;
            door.isPause = true;
            door.distance = 0;
            this.doors = this._doorsStore.filter(
              (door) => door.uuid !== this._mesh.uuid,
            );
            emitter.emit(EmitterEvents.doors); // обновляем
          }
        }

        // Закрываем дверь
        if (door.isPause && door.time > 3) {
          door.isPause = false;
          door.isClose = true;
          self.audio.replayObjectSound(door.id, Audios.door);

          // Ну вот такое!!! (я пока не смог понять почему)
          setTimeout(() => {
            this.doors = this._doorsStore;
            emitter.emit(EmitterEvents.doors); // обновляем
          }, 100);
        }

        // Закрытие двери
        if (door.isClose) {
          // Останавливаем дверь
          if (door.distance >= 5) {
            this._mesh.position.y = 1.75;
            this._bus = this._bus.filter((item) => item.id !== door.id);
            this.doors = this._doorsStore;
            emitter.emit(EmitterEvents.doors); // обновляем
          }
        }
      }
    });
  }

  // На открытие двери
  public door(self: ISelf, id: string): boolean {
    if (!this._bus.find((door) => door.id === id)) {
      this._bus.push({
        id,
        isOpen: true,
        isPause: false,
        isClose: false,
        direction: false,
        distance: 0,
        time: 0,
      } as Doors);
      this._mesh = self.scene.getObjectByProperty('uuid', id) as THREE.Mesh;
      if (this._mesh) {
        self.audio.replayObjectSound(id, Audios.door);
      }
      return true;
    }
    return false;
  }
}
