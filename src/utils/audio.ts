// Audio Helper
//////////////////////////////////////////////////////

import * as THREE from 'three';

// Constants
import { Colors, Audios, Names } from '@/utils/constants';

// Types
import type { ISelf } from '@/models/modules';
import type { TAudio, TPositionalAudio } from '@/models/utils';
import type { Audio, PositionalAudio, Mesh, Group } from 'three';

export default class AudioBus {
  public name = Names.audio;

  private _bus!: Array<TAudio>;
  private _bus2!: Array<TPositionalAudio>;
  private _heroSound!: Mesh;
  private _audio!: Audio;
  private _positionalAudio!: PositionalAudio;
  private _record?: TAudio | TPositionalAudio;
  private _item: Mesh | Group = new THREE.Mesh();
  private _is!: boolean;

  constructor() {
    this._bus = [];
    this._bus2 = [];
  }

  init(self: ISelf): void {
    // Hero sound

    // Форма
    self.helper.geometry = new THREE.BoxBufferGeometry(1, 1, 1);

    // Mатериал
    self.helper.material = new THREE.MeshStandardMaterial({
      color: Colors.white,
    });

    this._heroSound = new THREE.Mesh(
      self.helper.geometry,
      self.helper.material,
    );
    this._heroSound.visible = false;
    self.scene.add(this._heroSound);

    self.helper.loaderDispatchHelper(self.store, this.name, true);
  }

  // Добавить трек на шину
  public addHeroAudioToBus(
    id: string,
    audio: Audio,
    name: Audios,
    isLoop: boolean,
  ): void {
    if (!isLoop) audio.onEnded = () => audio.stop();

    this._bus.push({
      id,
      name,
      audio,
      isStopped: false,
    });
  }

  // Добавить позиционированный трек на шину 2
  public addPositionalAudioToBus(
    id: string,
    name: Audios,
    isLoop: boolean,
  ): void {
    this._bus2.push({
      id,
      name,
      isStopped: false,
      isLoop,
    });
  }

  // Трек на герое по имени
  private _getRecordByName(name: Audios): TAudio | undefined {
    return this._bus.find((record) => record.name === name);
  }

  // Трек по айди и имени (позиционнированные аудио)
  private _getRecordByIdAndName(
    id: string,
    name: Audios,
  ): TPositionalAudio | undefined {
    return this._bus2.find(
      (record) => record.id === id && record.name === name,
    );
  }

  // Удалить трек по имени с шины позиционнированных аудио
  private _removeAudioByNameFromBus(id: string, name: string): void {
    this._bus2 = this._bus2.filter(
      (record) => record.id !== id && record.name !== name,
    );
  }

  // Удалить трек (позиционнированные аудио)
  public removeObjectAudioFromBus(id: string): void {
    this._bus2
      .filter((record) => record.id === id)
      .forEach((record) => {
        if (record.audio && record.audio.isPlaying)
          record.audio.stop();
      }
    );
    this._bus2 = this._bus2.filter((record) => record.id !== id);
  }

  // Добавить трек на героя
  public addAudioToHero(self: ISelf, buffer: AudioBuffer, name: Audios): void {
    this._audio = new THREE.Audio(self.listener);

    this._is = this._getIsLoopByName(name, true);

    this._audio.setBuffer(buffer);
    this._audio.setVolume(self.assets.getVolumeByName(name));
    this._audio.setLoop(this._is);

    this.addHeroAudioToBus(this._heroSound.uuid, this._audio, name, this._is);

    this._heroSound.add(this._audio);
  }

  // Узнать закольцован ли звук по имени
  private _getIsLoopByName(name: Audios, isHeroSound: boolean): boolean {
    if (isHeroSound) {
      switch (name) {
        case Audios.wind:
          return true;
        default:
          return false;
      }
    } else {
      switch (name) {
        case Audios.steps:
        case Audios.mutantsteps:
        case Audios.cyborgsteps:
        case Audios.zombieidle:
        case Audios.mutantidle:
        case Audios.soldieridle:
        case Audios.orcidle:
          return true;
        default:
          return false;
      }
    }
  }

  // Помощник добавления позиционированого аудио
  private _setPositionalAudio(
    self: ISelf,
    audio: PositionalAudio,
    name: Audios,
    isLoop: boolean,
  ) {
    try {
      audio.setBuffer(self.assets.getAudio(name));
      audio.setVolume(self.assets.getVolumeByName(name));
      audio.setLoop(isLoop);
      audio.setRefDistance(process.env.VUE_APP_SOUND_REF);
      audio.setMaxDistance(process.env.VUE_APP_SOUND_MAX);
      audio.setRolloffFactor(1);
    } catch(e) {
      console.log('audio bus ERROR: ', e);
    }
  }

  // Активировать трек по имени на объектах после загрузки
  public initAudioByName(self: ISelf, name: Audios): void {
    this._bus2
      .filter((record) => record.name === name)
      .forEach((record) => {
        this._positionalAudio = new THREE.PositionalAudio(self.listener);

        this._setPositionalAudio(
          self,
          this._positionalAudio,
          name,
          record.isLoop,
        );

        if (!record.isLoop)
          this._positionalAudio.onEnded = () => this._positionalAudio.stop();
        record.audio = this._positionalAudio;

        this._item = self.scene.getObjectByProperty('uuid', record.id) as Mesh;
        this._item.add(this._positionalAudio);

        // Обработка паузы - для синглплеера
        // this._is = self.store.getters['persist/isPause'];
        // if (this._is) record.isStopped = true;
        // else this._positionalAudio.play();

        this._positionalAudio.play();
      });
  }

  /*
  // Активировать трек по имени на объекте после добавления (для стратегии, например)
  public initAudioByIdAndName(self: ISelf, id: string, name: Audios): void {
    this._record = this._getRecordByIdAndName(id, name);

    if (this._record) {
      this._positionalAudio = new THREE.PositionalAudio(self.listener);
      this._is = this._getIsLoopByName(name, false);

      this._setPositionalAudio(self, this._positionalAudio, name, this._is);

      if (!this._is)
        this._positionalAudio.onEnded = () => this._positionalAudio.stop();

      this._record.audio = this._positionalAudio;

      this._item = self.scene.getObjectByProperty('uuid', id) as Mesh;
      this._item.add(this._positionalAudio);

      this._is = self.store.getters['persist/isPause'];
      if (this._is) this._record.isStopped = true;
      else if (this._record?.audio && !this._record.audio.isPlaying)
        this._record.audio.play();
    }
  } */

  // Добавить трек на одном объекте
  private _addAudioOnObjectHelper(self: ISelf, id: string, name: Audios) {
    this._is = this._getIsLoopByName(name, false);
    this.addPositionalAudioToBus(id, name, this._is);

    this._positionalAudio = new THREE.PositionalAudio(self.listener);
    this._setPositionalAudio(self, this._positionalAudio, name, this._is);

    this._record = this._getRecordByIdAndName(id, name);
    if (this._record) this._record.audio = this._positionalAudio;

    this._item = self.scene.getObjectByProperty('uuid', id) as Mesh;
    this._item.add(this._positionalAudio);
  }

  // Добавить трек на одном объекте
  public addAudioOnObject(self: ISelf, id: string, name: Audios): void {
    this._addAudioOnObjectHelper(self, id, name);
  }

  // Добавить и отыграть трек на одном объекте
  public addAndPlayAudioOnObject(self: ISelf, id: string, name: Audios): void {
    // console.log('audio bus pauseObjectSound: ', name);
    this._addAudioOnObjectHelper(self, id, name);

    this._positionalAudio.play();
    this._positionalAudio.onEnded = () => {
      if (this._positionalAudio && this._positionalAudio.isPlaying)
        this._positionalAudio.stop();
      this._removeAudioByNameFromBus(id, name);
    };
  }

  /*
  // Пауза (для синглплеера)
  public toggle(isPause: boolean): void {
    if (isPause) {
      this._bus
        .filter((record) => record.audio.isPlaying)
        .forEach((record) => {
          record.isStopped = true;
          record.audio.pause();
        });
      this._bus2
        .filter((record) => record.audio && record.audio.isPlaying)
        .forEach((record) => {
          record.isStopped = true;
          if (record.audio) record.audio.pause();
        });
    } else {
      this._bus
        .filter((record) => record.isStopped)
        .forEach((record) => {
          record.isStopped = false;
          record.audio.play();
        });
      this._bus2
        .filter((record) => record.audio && record.isStopped)
        .forEach((record) => {
          record.isStopped = false;
          if (record.audio) record.audio.play();
        });

      // Ветер
      if (
        this._bus.find(
          (record) => record.name === Audios.wind && !record.audio.isPlaying,
        )
      )
        this.startHeroSound(Audios.wind);
    }
  } */

  // Получить звук на герое
  public getHeroSound(name: Audios): Audio {
    return this._getRecordByName(name)?.audio as Audio;
  }

  // Запустить звук на герое
  public startHeroSound(name: Audios): void {
    this._record = this._getRecordByName(name);
    if (this._record && this._record.audio && !this._record.audio.isPlaying)
      this._record.audio.play();
  }

  // Остановить звук на герое
  public pauseHeroSound(name: Audios): void {
    this._record = this._getRecordByName(name);
    if (this._record && this._record.audio && this._record.audio.isPlaying)
      this._record.audio.pause();
  }

  // Переиграть звук на герое
  public replayHeroSound(name: Audios): void {
    this._record = this._getRecordByName(name);
    if (this._record && this._record.audio) {
      if (this._record.audio.isPlaying) this._record.audio.stop();
      this._record.audio.play();
    }
  }

  // Изменить скорость звука на герое
  public setPlaybackRateOnHeroSound(name: Audios, rate: number): void {
    this._record = this._getRecordByName(name);
    if (this._record && this._record.audio)
      this._record.audio.setPlaybackRate(rate);
  }

  // Изменить скорость звука на объекте
  public setPlaybackRateOnObjectSound(
    id: string,
    name: Audios,
    rate: number,
  ): void {
    this._record = this._getRecordByIdAndName(id, name);
    if (this._record && this._record.audio)
      this._record.audio.setPlaybackRate(rate);
  }

  // Изменить громкость звука на объекте
  public setVolumeOnObjectSound(
    id: string,
    name: Audios,
    volume: number,
  ): void {
    this._record = this._getRecordByIdAndName(id, name);
    if (this._record && this._record.audio)
      this._record.audio.setVolume(volume);
  }

  // Запустить звук на объекте
  public startObjectSound(id: string, name: Audios): void {
    // console.log('audio bus startObjectSound: ', name);
    this._record = this._getRecordByIdAndName(id, name);

    if (this._record && this._record.audio && !this._record.audio.isPlaying) {
      this._record.audio.play();
    }
  }

  // Остановить звук на объекте
  public stopObjectSound(id: string, name: Audios): void {
    // console.log('audio bus stopObjectSound: ', name);
    this._record = this._getRecordByIdAndName(id, name);
    if (this._record && this._record.audio && this._record.audio.isPlaying)
      this._record.audio.stop();
  }

  // Поставить на паузу на объекте
  public pauseObjectSound(id: string, name: Audios): void {
    // console.log('audio bus pauseObjectSound: ', name);
    this._record = this._getRecordByIdAndName(id, name);
    if (this._record && this._record.audio && this._record.audio.isPlaying)
      this._record.audio.pause();
  }

  // Переиграть звук на объекте
  public replayObjectSound(id: string, name: Audios): void {
    // console.log('audio bus replayObjectSound: ', name);
    this._record = this._getRecordByIdAndName(id, name);
    if (this._record && this._record.audio) {
      if (!this._record.audio.isPlaying) {
        this._record.audio.play();
      } else {
        this._record.audio.stop();
        this._record.audio.play();
      }
    }
  }
}
