import type { Text } from 'troika-three-text';
import type { AnimationAction, AnimationMixer, Group, Vector3 } from 'three';
import { Races, Lifecycle, Things, Picks } from '@/utils/constants';

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
  destroy = 'destroy', // Пользователь закрыл вкладку

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
  onPoint = 'onPoint', // На смену флага на контрольной точке
  dead = 'dead', // Новая мертвая коробка на сцене
  pick = 'pick', // Пользователь подобрал что-то
  onPick = 'onPick', // Ответ на подобрал что-то
  onOnPick = 'onPick', // Удаление после подбора предмета
  addThing = 'addThing', // Добавлена вещь на сцену
  removeThing = 'removeThing', // Вещь удалена со сцены
  use = 'use', // Игрок использовал предмет
  onUse = 'onUse', // На использовал предмет
  send = 'send', // Игрок отправил сообщение в чат
  onSend = 'onSend', // Ответ на сообщение в чат
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

export interface IStone2 {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotateY: number;
  rotateX: number;
}

export interface IPin {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotateY: number;
  rotateX: number;
  color: number;
}

export interface IGrass {
  x: number;
  z: number;
  scale: number;
}

export interface IZone {
  x: number;
  z: number;
  radius: number;
}

export interface ITrash {
  x: number;
  z: number;
  scale: number;
  scaleY: number;
  rotate: number;
}

export interface IWell {
  x: number;
  y: number;
  z: number;
  rotate: number;
}

export interface ITreeScene {
  model: Group;
  rotate: number;
}

export interface IStoneScene {
  model: Group;
  x: number;
  z: number;
}

export interface IWellScene {
  model: Group;
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
  rotate: number;
}

export interface IThing {
  x: number;
  z: number;
  y: number;
  id: string;
  type: Things;
  rotateY: number;
  rotateX: number;
}

export interface ILocation {
  id: string;
  x: number;
  y: number;
  name: string;
  ground: string;
  trees: ITree[];
  grasses: IGrass[];
  stones1: IStone[];
  stones2: IStone[];
  stones3: IStone[];
  stones4: IStone2[];
  stones5: IPin[];
  builds: IBuild[];
  users: string[];
  wells: IWell[];
  zones: IZone[];
  trashes: ITrash[];
  trashes2: ITrash[];
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
  flag: string;
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

export interface IThingThree extends IThing {
  model: string;
  pseudo: string;
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

export interface IObjectThree {
  id: number;
  mesh: string;
}

export interface IZoneThree {
  id: number;
  mesh: string;
  is2: boolean;
  is3: boolean;
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

export interface IMessage {
  id: string;
  location: string;
}

export interface IPickMessage extends IMessage {
  type: Picks;
  uuid: string;
  target: string;
  user: string;
}

export interface ISendMessage {
  name: string;
  race: Races;
  location: string;
  text: string;
}
