// Assets Helper
//////////////////////////////////////////////////////

import * as THREE from 'three';

// Constants
import { Textures, Colors, Audios, DESIGN } from '@/utils/constants';

// Types
import type { ISelf } from '@/models/modules';
import type {
  Texture,
  AudioLoader,
  MeshPhongMaterial,
  MeshBasicMaterial,
  MeshStandardMaterial,
} from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Modules
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Assets {
  // Textures
  private _concrette!: Texture;
  private _concrette2!: Texture;
  private _metall!: Texture;
  private _metall2!: Texture;
  private _fire!: Texture;
  private _glass!: Texture;

  // Loaders
  public GLTFLoader: GLTFLoader;
  public audioLoader: AudioLoader;
  public textureLoader: THREE.TextureLoader;

  // Audios

  // Weapon
  public explosion!: AudioBuffer;
  public shot!: AudioBuffer;
  public light!: AudioBuffer;

  // Players
  public steps!: AudioBuffer;
  public hit!: AudioBuffer;
  public jumpstart!: AudioBuffer;
  public jumpend!: AudioBuffer;
  public dead!: AudioBuffer;
  public pick!: AudioBuffer;

  // World
  public door!: AudioBuffer;

  // NPC

  // Zombie
  public zombieidle!: AudioBuffer;
  public zombiehit!: AudioBuffer;
  public zombiedead!: AudioBuffer;

  // Bidens
  public bidensidle!: AudioBuffer;
  public bidenshit!: AudioBuffer;
  public bidensdead!: AudioBuffer;

  // Mutant
  public mutantdead!: AudioBuffer;
  public mutantjumpend!: AudioBuffer;
  public mutanthit!: AudioBuffer;
  public mutantidle!: AudioBuffer;
  public mutantsteps!: AudioBuffer;

  // Orc
  public orchit!: AudioBuffer;
  public orcidle!: AudioBuffer;
  public orcdead!: AudioBuffer;

  // Soldier
  public soldierhit!: AudioBuffer;
  public soldieridle!: AudioBuffer;
  public soldierdead!: AudioBuffer;

  // Cyborg
  public cyborghit!: AudioBuffer;
  public cyborgdead!: AudioBuffer;
  public cyborgsteps!: AudioBuffer;
  public cyborgidle!: AudioBuffer;

  constructor() {
    this.GLTFLoader = new GLTFLoader();
    this.audioLoader = new THREE.AudioLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public init(self: ISelf) {
    // Textures
    this._concrette = self.helper.textureLoaderHelper(self, Textures.concrette);
    this._concrette2 = self.helper.textureLoaderHelper(
      self,
      Textures.concrette2,
    );
    this._metall = self.helper.textureLoaderHelper(self, Textures.metall);
    this._metall2 = self.helper.textureLoaderHelper(self, Textures.metall2);
    this._fire = self.helper.textureLoaderHelper(self, Textures.fire);
    this._glass = self.helper.textureLoaderHelper(self, Textures.glass);

    // Audio

    // Позиционированные на объектах

    // World
    this.audioLoader.load(`./audio/${Audios.door}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.door, false);
      this.door = buffer;
      self.audio.initAudioByName(self, Audios.door);
    });

    // Weapon

    this.audioLoader.load(`./audio/${Audios.explosion}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.explosion, false);
      this.explosion = buffer;
      self.audio.initAudioByName(self, Audios.explosion);
    });

    this.audioLoader.load(`./audio/${Audios.shot}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.shot, false);
      this.shot = buffer;
      self.audio.initAudioByName(self, Audios.shot);
    });

    this.audioLoader.load(`./audio/${Audios.light}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.light, false);
      this.light = buffer;
      self.audio.initAudioByName(self, Audios.light);
    });

    // Players

    this.audioLoader.load(`./audio/${Audios.pick}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.pick, false);
      this.pick = buffer;

      self.audio.initAudioByName(self, Audios.pick);
    });

    this.audioLoader.load(`./audio/${Audios.steps}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.steps, false);
      this.steps = buffer;

      self.audio.initAudioByName(self, Audios.steps);
    });

    this.audioLoader.load(`./audio/${Audios.jumpstart}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.jumpstart, false);
      this.jumpstart = buffer;

      self.audio.initAudioByName(self, Audios.jumpstart);
    });

    this.audioLoader.load(`./audio/${Audios.jumpend}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.jumpend, false);
      this.jumpend = buffer;

      self.audio.initAudioByName(self, Audios.jumpend);
    });

    this.audioLoader.load(`./audio/${Audios.hit}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.hit, false);
      this.hit = buffer;

      self.audio.initAudioByName(self, Audios.hit);
    });

    this.audioLoader.load(`./audio/${Audios.dead}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.dead, false);
      this.dead = buffer;

      self.audio.initAudioByName(self, Audios.dead);
    });

    // NPC

    // Zombie

    this.audioLoader.load(`./audio/${Audios.zombieidle}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.zombieidle, false);
      this.zombieidle = buffer;

      self.audio.initAudioByName(self, Audios.zombieidle);
    });

    this.audioLoader.load(`./audio/${Audios.zombiehit}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.zombiehit, false);
      this.zombiehit = buffer;

      self.audio.initAudioByName(self, Audios.zombiehit);
    });

    this.audioLoader.load(`./audio/${Audios.zombiedead}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.zombiedead, false);
      this.zombiedead = buffer;

      self.audio.initAudioByName(self, Audios.zombiedead);
    });

    // Bidens

    this.audioLoader.load(`./audio/${Audios.bidensidle}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.bidensidle, false);
      this.bidensidle = buffer;

      self.audio.initAudioByName(self, Audios.bidensidle);
    });

    this.audioLoader.load(`./audio/${Audios.bidenshit}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.bidenshit, false);
      this.bidenshit = buffer;

      self.audio.initAudioByName(self, Audios.bidenshit);
    });

    this.audioLoader.load(`./audio/${Audios.bidensdead}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.bidensdead, false);
      this.bidensdead = buffer;

      self.audio.initAudioByName(self, Audios.bidensdead);
    });
    
    // Mutant

    this.audioLoader.load(`./audio/${Audios.mutantdead}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.mutantdead, false);
      this.mutantdead = buffer;

      self.audio.initAudioByName(self, Audios.mutantdead);
    });

    this.audioLoader.load(`./audio/${Audios.mutantjumpend}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.mutantjumpend, false);
      this.mutantjumpend = buffer;

      self.audio.initAudioByName(self, Audios.mutantjumpend);
    });

    this.audioLoader.load(`./audio/${Audios.mutanthit}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.mutanthit, false);
      this.mutanthit = buffer;

      self.audio.initAudioByName(self, Audios.mutanthit);
    });

    this.audioLoader.load(`./audio/${Audios.mutantidle}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.mutantidle, false);
      this.mutantidle = buffer;

      self.audio.initAudioByName(self, Audios.mutantidle);
    });

    this.audioLoader.load(`./audio/${Audios.mutantsteps}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.mutantsteps, false);
      this.mutantsteps = buffer;

      self.audio.initAudioByName(self, Audios.mutantsteps);
    });

    // Orc

    this.audioLoader.load(`./audio/${Audios.orchit}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.orchit, false);
      this.orchit = buffer;

      self.audio.initAudioByName(self, Audios.orchit);
    });

    this.audioLoader.load(`./audio/${Audios.orcidle}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.orcidle, false);
      this.orcidle = buffer;

      self.audio.initAudioByName(self, Audios.orcidle);
    });

    this.audioLoader.load(`./audio/${Audios.orcdead}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.orcdead, false);
      this.orcdead = buffer;

      self.audio.initAudioByName(self, Audios.orcdead);
    });

    // Soldier

    this.audioLoader.load(`./audio/${Audios.soldierhit}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.soldierhit, false);
      this.soldierhit = buffer;

      self.audio.initAudioByName(self, Audios.soldierhit);
    });

    this.audioLoader.load(`./audio/${Audios.soldieridle}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.soldieridle, false);
      this.soldieridle = buffer;

      self.audio.initAudioByName(self, Audios.soldieridle);
    });

    this.audioLoader.load(`./audio/${Audios.soldierdead}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.soldierdead, false);
      this.soldierdead = buffer;

      self.audio.initAudioByName(self, Audios.soldierdead);
    });

    // Cyborg

    this.audioLoader.load(`./audio/${Audios.cyborghit}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.cyborghit, false);
      this.cyborghit = buffer;

      self.audio.initAudioByName(self, Audios.cyborghit);
    });

    this.audioLoader.load(`./audio/${Audios.cyborgdead}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.cyborgdead, false);
      this.cyborgdead = buffer;

      self.audio.initAudioByName(self, Audios.cyborgdead);
    });

    this.audioLoader.load(`./audio/${Audios.cyborgsteps}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.cyborgsteps, false);
      this.cyborgsteps = buffer;

      self.audio.initAudioByName(self, Audios.cyborgsteps);
    });

    this.audioLoader.load(`./audio/${Audios.cyborgidle}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(self.store, Audios.cyborgidle, false);
      this.cyborgidle = buffer;

      self.audio.initAudioByName(self, Audios.cyborgidle);
    });

    // На герое
    self.helper.setAudioToHeroHelper(self, Audios.wind);
    self.helper.setAudioToHeroHelper(self, Audios.jumpstart, this.jumpstart);
    self.helper.setAudioToHeroHelper(self, Audios.steps, this.steps);
    self.helper.setAudioToHeroHelper(self, Audios.jumpend, this.jumpend);
    self.helper.setAudioToHeroHelper(self, Audios.shot, this.shot);
    self.helper.setAudioToHeroHelper(self, Audios.hit, this.hit);
    self.helper.setAudioToHeroHelper(self, Audios.dead, this.dead);
    self.helper.setAudioToHeroHelper(self, Audios.pick, this.pick);
  }

  // Texture utils

  public traverseHelper(self: ISelf, model: GLTF): GLTF {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model.scene.traverse((child: any) => {
      if (child.isMesh) {
        if (child.name.includes(Textures.concrette2)) {
          child.material = this.getMaterial(Textures.concrette2);
        } else if (child.name.includes(Textures.concrette)) {
          child.material = this.getMaterial(Textures.concrette);
        } else if (child.name.includes(Textures.glassspecial)) {
          child.material = this.getMaterial(Textures.glassspecial);
        } else if (child.name.includes(Textures.glass)) {
          child.material = this.getMaterial(Textures.glass);
        } else if (child.name.includes(Textures.metallDark)) {
          child.material = this.getMaterialWithColor(
            Textures.metall,
            0x222222 as Colors,
          );
        } else if (child.name.includes(Textures.metall2)) {
          child.material = this.getMaterial(Textures.metall2);
        } else if (child.name.includes(Textures.metall)) {
          child.material = this.getMaterial(Textures.metall);
        } else if (child.name.includes(Textures.fire)) {
          child.material = this.getMaterial(Textures.fire);
        } else if (child.name.includes(Textures.grass)) {
          child.material = this.getMaterial(Textures.grass);
        } else if (child.name.includes(Textures.playerred)) {
          child.material = this.getMaterial(Textures.playerred);
        } else if (child.name.includes(Textures.playerblue)) {
          child.material = this.getMaterial(Textures.playerblue);
        } else if (child.name.includes(Textures.hole)) {
          child.material = this.getMaterial(Textures.hole);
        }
      }
    });
    return model;
  }

  // Получить текстуру
  public getTexture(name: Textures): Texture {
    switch (name) {
      case Textures.concrette2:
        return this._concrette2;
      case Textures.metall:
        return this._metall;
      case Textures.metall2:
        return this._metall2;
      case Textures.fire:
        return this._fire;
      case Textures.glass:
        return this._glass;
      case Textures.concrette:
      default:
        return this._concrette;
    }
  }

  // Повторения текстуры по имени
  public getRepeatByName(name: Textures): number {
    switch (name) {
      case Textures.ground:
        return 256;
      case Textures.glass:
        return 16;
      case Textures.concrette:
      case Textures.concrette2:
      case Textures.fire:
        return 4;
      case Textures.metall:
      case Textures.metall2:
        return 2;
    }
    return 2;
  }

  // Получить материал
  public getMaterialWithColor(
    name: Textures,
    color: Colors,
  ): MeshPhongMaterial | MeshBasicMaterial | MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      map: this.getTexture(name),
      color,
    });
  }

  // Получить материал
  public getMaterial(
    name: Textures,
  ): MeshPhongMaterial | MeshBasicMaterial | MeshStandardMaterial {
    switch (name) {
      case Textures.pseudo:
        return new THREE.MeshStandardMaterial({
          transparent: true,
          opacity: 0.5,
          color: Colors.scale,
          side: THREE.DoubleSide,
        });
      case Textures.grass:
        return new THREE.MeshPhongMaterial({
          color: Colors.grass,
        });
      case Textures.scale:
        return new THREE.MeshStandardMaterial({
          color: Colors.scale,
          transparent: true,
          opacity: 0.5,
        });
      case Textures.hole:
        return new THREE.MeshStandardMaterial({
          color: Colors.black,
        });
      case Textures.blood:
        return new THREE.MeshBasicMaterial({
          color: Colors.blood,
          transparent: true,
          opacity: 0,
        });
      case Textures.light:
        return new THREE.MeshStandardMaterial({
          color: Colors.white,
        });
      case Textures.fire:
        return new THREE.MeshStandardMaterial({
          map: this.getTexture(name),
          color: Colors.white,
          transparent: true,
          opacity: 0,
        });
      case Textures.concrette:
        return new THREE.MeshPhongMaterial({
          map: this.getTexture(name),
          color: Colors.concrette,
        });
      case Textures.concrette2:
        return new THREE.MeshStandardMaterial({
          map: this.getTexture(name),
          color: Colors.stones,
          side: THREE.DoubleSide,
        });
      case Textures.glassspecial:
        return new THREE.MeshStandardMaterial({
          color: Colors.white,
          transparent: true,
          opacity: 0.25,
        });
      case Textures.glass:
        return new THREE.MeshPhongMaterial({
          map: this.getTexture(name),
          color: Colors.glass,
          transparent: true,
          opacity: 0.33,
        });
      case Textures.metall:
        return new THREE.MeshStandardMaterial({
          map: this.getTexture(name),
          color: Colors.metall,
        });
      case Textures.metall2:
        return new THREE.MeshStandardMaterial({
          map: this.getTexture(name),
          color: Colors.metall2,
        });
      case Textures.playerred:
        return new THREE.MeshStandardMaterial({
          map: this.getTexture(name),
          color: Colors.red,
        });
      case Textures.playerblue:
        return new THREE.MeshStandardMaterial({
          map: this.getTexture(name),
          color: Colors.blue,
        });
    }
    return new THREE.MeshPhongMaterial({
      map: this.getTexture(name),
      color: Colors[name as unknown as keyof typeof Colors],
    });
  }

  // Audio utils
  // Получить громкость по имени
  public getVolumeByName(name: Audios): number {
    switch (name) {
      case Audios.jumpend:
      case Audios.steps:
      case Audios.wind:
      case Audios.mutantidle:
        return 0.3;
      case Audios.soldieridle:
      case Audios.cyborgsteps:
        return 0.4;
      case Audios.cyborgidle:
      case Audios.orcidle:
        return 0.5;
      case Audios.zombieidle:
        return 0.6;
      case Audios.dead:
      case Audios.mutantsteps:
        return 0.7;
      case Audios.shot:
      case Audios.hit:
      case Audios.mutantjumpend:
      case Audios.pick:
        return 0.8;
      case Audios.cyborghit:
      case Audios.bidensidle:
      case Audios.explosion:
      case Audios.jumpstart:
      case Audios.zombiehit:
      case Audios.zombiedead:
      case Audios.soldierdead:
      case Audios.soldierhit:
      case Audios.cyborgdead:
      case Audios.orcdead:
      case Audios.orchit:
      case Audios.mutanthit:
      case Audios.mutantdead:
      case Audios.bidensdead:
      case Audios.bidenshit:
      case Audios.light:
      case Audios.door:
        return 1;
    }
    return DESIGN.DEFAULT_VOLUME;
  }

  // Получить звук
  public getAudio(name: Audios): AudioBuffer {
    // console.log('Assets getAudio', name);
    switch (name) {
      case Audios.explosion:
        return this.explosion;
      case Audios.shot:
        return this.shot;
      case Audios.jumpstart:
        return this.jumpstart;
      case Audios.jumpend:
        return this.jumpend;
      case Audios.steps:
        return this.steps;
      case Audios.hit:
        return this.hit;
      case Audios.dead:
        return this.dead;
      case Audios.zombieidle:
        return this.zombieidle;
      case Audios.zombiehit:
        return this.zombiehit;
      case Audios.zombiedead:
        return this.zombiedead;
      case Audios.bidensidle:
        return this.bidensidle;
      case Audios.bidenshit:
        return this.bidenshit;
      case Audios.bidensdead:
        return this.bidensdead;
      case Audios.mutantdead:
        return this.mutantdead;
      case Audios.mutantjumpend:
        return this.mutantjumpend;
      case Audios.mutanthit:
        return this.mutanthit;
      case Audios.mutantidle:
        return this.mutantidle;
      case Audios.mutantsteps:
        return this.mutantsteps;
      case Audios.orchit:
        return this.orchit;
      case Audios.orcdead:
        return this.orcdead;
      case Audios.orcidle:
        return this.orcidle;
      case Audios.soldieridle:
        return this.soldieridle;
      case Audios.soldierhit:
        return this.soldierhit;
      case Audios.soldierdead:
        return this.soldierdead;
      case Audios.cyborgdead:
        return this.cyborgdead;
      case Audios.cyborghit:
        return this.cyborghit;
      case Audios.cyborgsteps:
        return this.cyborgsteps;
      case Audios.cyborgidle:
        return this.cyborgidle;
      case Audios.light:
        return this.light;
    }
    return this.explosion;
  }
}
