// Types
import type { ISelf } from '@/models/modules';
import { IShot, IUnitInfo } from '@/models/api';

// Constants
import { Names } from '@/utils/constants';

// Modules
import Hero from '@/components/Scene/World/Hero/Hero';
import Enemies from '@/components/Scene/World/Enemies/Enemies';

export default class Players {
  public name = Names.players;

  // Modules
  private _enemies: Enemies;
  private _hero: Hero;

  constructor() {
    // Modules
    this._enemies = new Enemies();
    this._hero = new Hero();
  }

  public init(self: ISelf): void {
    // Modules
    this._hero.init(self);
    this._enemies.init(self);
  }

  public shot(self: ISelf): IShot | null {
    return this._hero.shot(self);
  }

  public onHit(self: ISelf, users: string[]) {
    this._enemies.onHit(self, users);
  }

  public getList(): IUnitInfo[] {
    return this._enemies.getList();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public animate(self: ISelf): void {
    // Animated modules
    this._hero.animate(self);
    this._enemies.animate(self);
    this._enemies.animate(self);
  }
}
