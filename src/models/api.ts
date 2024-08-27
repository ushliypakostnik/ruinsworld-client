import type { Text } from 'troika-three-text';
import type { AnimationAction, AnimationMixer, Group, Vector3 } from 'three';
import { Races, Lifecycle } from '@/utils/constants';

// API Interfaces
///////////////////////////////////////////////////////

// Websockets
export enum EmitterEvents {
  onConnect = 'onConnect', // На присоединение пользователя
  onOnConnect = 'onOnConnect', // Ответ клиента серверу на соединение
  newPlayer = 'newPlayer', // Пришел без айди или с неправильным айди
  onUpdatePlayer = 'onUpdatePlayer', // Подтвердить нового игрока
  enter = 'enter', // Назваться и зайти в игру
  onEnter = 'onEnter', // Отклик сервера о заходе
  reenter = 'reenter', // Начать сначала

  updateToClients = 'updateToClients', // Постоянные обновления клиентам
  updateToServer = 'updateToServer', // Пришло обновление от клиента

  shot = 'shot', // Выстрел
  onShot = 'onShot', // На выстрел
  unshot = 'unshot', // Удаление выстрела
  onUnshot = 'onUnshot', // На удаление выстрела
  explosion = 'explosion', // На взрыв
  onExplosion = 'onExplosion', // На ответ взрыв
  hits = 'hits', // Урон
  selfharm = 'selfharm', // Самоповреждение
  onSelfharm = 'onSelfharm', // На самоповреждение
  relocation = 'relocation', // Переход на другую локацию
  onRelocation = 'onRelocation', // На переход на другую локацию
  location = 'location', // Игрок загрузился на локации
  userDead = 'userDead', // Игрок умер

  door = 'door', // Игрок открыл дверь
  doors = 'doors', // Нужно обновить двери
  point = 'point', // Смена флага на контрольной точке
  dead = 'dead', // Новая мертвая коробка на сцене
  pick = 'pick', // Пользователь подобрал что-то
  onPick = 'onPick', // Ответ на подобрал что-то
}

// Мир
export interface ITree {
  x: number;
  z: number;
  scale: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
}

export interface IStone {
  x: number;
  z: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  rotateY: number;
}

export interface IStone2 extends IStone {
  model: number;
}

export interface IGrass {
  x: number;
  z: number;
  scale: number;
}

export interface ITreeScene {
  model: Group;
  rotate: number;
}

export interface IBuild {
  x: number;
  z: number;
  scale: number;
  scaleY: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
}

export interface IPoint {
  x: number;
  z: number;
  rotateY: number;
}

export interface IGrassScene {
  model: Group;
  model2: Group;
  rotate: number;
}

export interface ILocation {
  id: string;
  x: number;
  y: number;
  name: string;
  ground: string;
  trees: ITree[];
  grasses: IGrass[];
  stones: IStone[];
  stones2: IStone2[];
  builds: IBuild[];
  users: string[];
}

// Движущийся объект принадлежащий игроку (выстрел) или сам игрок
export interface IMoveObject {
  positionX: number;
  positionY: number;
  positionZ: number;
  directionX: number;
  directionY: number;
  directionZ: number;
  directionW: number;
  rotationY: number;
}

// Выстрел
export interface IShot extends IMoveObject {
  id: number | null;
  player: string;
  location: string;
  startX: number;
  startY: number;
  startZ: number;
  time: number;
}

export interface IShotThree extends IShot {
  model: string;
}

// Выстрел неписи
export interface ILight extends IMoveObject {
  id: number | null;
  race: Races,
  target: string;
  location: string;
  startX: number;
  startY: number;
  startZ: number;
  is: boolean;
}

export interface ILightThree extends ILight {
  model: string;
  sound: string;
  start: THREE.Vector3;
}

export interface IExplosion extends IShot {
  enemy: string;
}

export interface IExplosionThree extends IShot {
  model: string;
  scale: number;
  isOff: boolean;
}

export interface IOnExplosion {
  message: IExplosion;
  updates: IUpdateMessage[];
}

// Игрок

export interface IUnit extends IMoveObject {
  lifecycle: Lifecycle;
  id: string;
  race: Races;
  name: string;
  health: number;
  animation: string;
  isJump: boolean;
  isFire: boolean;
  isOnHit: boolean;
  isOnHit2: boolean;
  exp: number;
}

export interface IUnitThree extends IUnit {
  model: string;
  pseudo: string;
  sound: string;
  scale: string;
  weapon: string;
  fire: string;
  text: typeof Text;
  isHide: boolean;
  isRun: boolean;
  isMove: boolean;
  isNotJump: boolean;
  isDead: boolean;
  mixer: AnimationMixer;
  prevAction: AnimationAction;
  nextAction: AnimationAction;
  isFire: boolean;
  isFireOff: boolean;
  fireScale: number;
  fireTimer: number;
  isStepsPlay: boolean;
  isStepsStop: boolean;
  isIdlePlay: boolean;
  isIdleStop: boolean;
  isSetDead: boolean;
}

// Оружие

export interface IUnitInfo {
  id: string;
  pseudo: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  race: Races;
}

// Кровь
export interface IBlood {
  id: number;
  velocity: Vector3;
  mesh: string;
  scale: number;
  isOff: boolean;
  race: Races;
}

// Обновления игрока
export interface IUpdateMessage {
  [key: string]: number | string | boolean | null;
}

// Обновления игры

export interface IWeaponModule {
  [key: string]: IShot[];
}

export interface IModule {
  [key: string]: IUnit[];
}

export interface IGameUpdates {
  point: IPoint;
  users: IUnit[];
  weapon: IWeaponModule;
  npc: IModule,
}

export interface IUserUpdate {
  player: IUpdateMessage;
  npc: IUnit[],
}

export interface IHitsUpdate {
  users: string[];
  npc: string[];
}
