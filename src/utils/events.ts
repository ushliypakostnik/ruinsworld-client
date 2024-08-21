// Events Helper
//////////////////////////////////////////////////////

// Constants
import { DESIGN } from '@/utils/constants';

// Types
import type { ISelf } from '@/models/modules';
import type { TEvents, TEventsData } from '@/models/utils';
import { Clock } from 'three';

export default class Events {
  public delta!: number;

  private _clock: Clock;
  private _bus!: Array<TEvents>;
  private _id!: number;
  private _pause!: number;

  constructor() {
    this._clock = new Clock(false);
    this.delta = this._clock.getDelta();
    this._bus = [];
    this._id = 1;
  }

  // Добавить запись
  public addEventsToBus(
    delay: number,
    data: TEventsData,
    callback: (data: TEventsData) => void,
  ): void {
    this._bus.push({
      id: this._id,
      time: 0,
      delay,
      data,
      callback,
    });
    ++this._id;
  }

  // Удалить запись
  private _removeEventsFromBus(id: number): void {
    // eslint-disable-next-line no-const-assign
    this._bus = this._bus.filter((record) => record.id !== id);
  }

  // Задержка события
  public delayDispatchHelper(
    delay: number,
    callback: (data: TEventsData) => void,
  ): void {
    this._pause = delay || DESIGN.ANIMATION_TIMEOUT / 1000;

    this.addEventsToBus(this._pause, null, (data) => callback(data));
  }

  // Помощник показа экранных сообщений
  public messagesByIdDispatchHelper(
    self: ISelf,
    text: string,
    delay?: number,
  ): void {
    this._pause = delay || DESIGN.MESSAGES_TIMEOUT / 1000;

    self.store
      .dispatch('not/showMessage', { id: this._id, text })
      .catch((error) => {
        console.log(error);
      });

    this.addEventsToBus(this._pause, this._id, (data) => {
      self.store.dispatch('not/hideMessage', data);
    });
  }

  public animate(): void {
    if (!this._clock.running) this.start();

    this.delta = this._clock.getDelta();
    this._bus.forEach((record) => {
      record.time += this.delta;
      if (record.time > record.delay) {
        record.callback(record.data as number);
        this._removeEventsFromBus(record.id);
      }
    });
  }

  public pause(): void {
    if (this._clock.running) this._clock.stop();
  }

  public start(): void {
    if (!this._clock.running) this._clock.start();
  }
}
