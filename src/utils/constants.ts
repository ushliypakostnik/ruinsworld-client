// Prohects еnums ans constants
//////////////////////////////////////////////////////

// Types
import type { TConfig, TMessages } from '@/models/utils';

// Enums

// Gameplay

export enum Races {
  // Players
  human = 'human',
  reptiloid = 'reptiloid',

  // NPC
  bidens = 'bidens',
  mutant = 'mutant',
  orc = 'orc',
  zombie = 'zombie',
  soldier = 'soldier',
  cyborg = 'cyborg',
}

export enum Lifecycle {
  born = 'born',
  idle = 'idle',
  attention = 'attention',
  attack = 'attack',
  dead = 'dead',
}

// Modules
export enum Names {
  audio = 'audio',
  world = 'world',
  atmosphere = 'atmosphere',
  players = 'players',
  hero = 'hero',
  enemies = 'enemies',
  zombies = 'zombies',
  trees = 'trees',
  stones = 'stones',
  stones2 = 'stones2',
  grasses = 'grasses',
  hills = 'hills',
  points = 'points',
}

export enum Modes {
  idle = 'idle',
  active = 'active',
  dead = 'dead',
}

export enum Pick {
  dead = 'dead',
  thing = 'thing',
}

export enum Animations {
  // Stand
  stand = 'stand',
  standforward = 'standforward',
  standback = 'standback',
  standleft = 'standleft',
  standright = 'standright',
  run = 'run',

  // Hide
  hide = 'hide',
  hideback = 'hideback',
  hideleft = 'hideleft',
  hideright = 'hideright',
  hideforward = 'hideforward',

  // Fire
  firestand = 'firestand',
  firestandforward = 'firestandforward',
  firehide = 'firehide',
  firehideforward = 'firehideforward',

  // Others
  hit = 'hit',
  jump = 'jump',
  dead = 'dead',

  // NPC
  idle = 'idle',
  walking = 'walking',
  kick = 'kick',
  cry = 'cry',
  attack = 'attack',
  back = 'back',
}

// GUI

export enum Textures {
  sky = 'sky',
  night = 'night',
  ground = 'ground',
  concrette = 'concrette',
  concrette2 = 'concrette2',
  glass = 'glass',
  glassspecial = 'glassspecial',
  metallDark = 'metallDark',
  metall = 'metall',
  metall2 = 'metall2',
  fire = 'fire',
  fire2 = 'fire2',
  light = 'light',
  pseudo = 'pseudo',
  scale = 'scale',
  hole = 'hole',
  blood = 'blood',
  grass = 'grass',
  playerred = 'playerred',
  playerblue = 'playerblue',
}

export enum Audios {
  // World
  wind = 'wind',
  door = 'door',

  // Players
  steps = 'steps',
  jumpstart = 'jumpstart',
  jumpend = 'jumpend',
  shot = 'shot',
  hit = 'hit',
  dead = 'dead',
  pick = 'pick',

  // Weapon
  explosion = 'explosion',
  light = 'light',
  
  // NPC

  // Zombie
  zombieidle = 'zombieidle',
  zombiehit = 'zombiehit',
  zombiedead = 'zombiedead',
  
  // Bidens
  bidensidle = 'bidensidle',
  bidenshit = 'bidenshit',
  bidensdead = 'bidensdead',

  // Mutant
  mutantdead = 'mutantdead',
  mutantjumpend = 'mutantjumpend',
  mutanthit = 'mutanthit',
  mutantidle = 'mutantidle',
  mutantsteps = 'mutantsteps',

  // Orc
  orchit = 'orchit',
  orcidle = 'orcidle',
  orcdead = 'orcdead',

  // Soldier
  soldierhit = 'soldierhit',
  soldieridle = 'soldieridle',
  soldierdead = 'soldierdead',

  // Cyborg
  cyborghit = 'cyborghit',
  cyborgdead = 'cyborgdead',
  cyborgsteps = 'cyborgsteps',
  cyborgidle = 'cyborgidle',
}

export enum Colors {
  white = 0xffffff,
  black = 0x000000,
  // yellow = 0xfed564,
  yellowDark = 0xe6a800,
  fog = 0xa48ed8,
  sun = 0xfdb813,
  toruch = 0xffff99,
  sky = 0x77deac,
  metall = 0x999999,
  metall2 = 0xee99aa,
  fire = 0xff6666,
  scale = 0x681a13,
  glass = 0xaaaaaa,
  blood = 0x8d0000,
  grass = 0x030500,
  red = 0xff0000,
  blue = 0x0000ff,
  bluelight = 0x00bfff,

  concrette = 0x6f6f6f,
  stones =  0x3f1f0f, // северо-восток
  stones2 = 0x1f0f1f, // юго-восток
  stones3 = 0x4f4f4f, // северо-запад
  stones4 = 0xa0a0f0, // юго-запад
}

enum Breakpoints {
  desktop = 1025,
}

enum Languages {
  en = 'en',
  ru = 'ru',
}

// Configuration

const isProd = process.env.NODE_ENV === 'production';
const apiUrl = process.env.VUE_APP_API_URL;
export const API_URL = isProd
  ? apiUrl || '//api.robot-game.ru'
  : apiUrl || 'http://localhost:3000';

export const LANGUAGES: string[] = [Languages.en, Languages.ru];

// Конфиг
export const DESIGN: TConfig = {
  V: '1.0.0',
  BREAKPOINTS: Breakpoints,
  SIZE: 300,
  CAMERA: {
    fov: 80,
    fog: Colors.fog,
  },
  HIT_TIMEOUT: 500, // ms
  MESSAGES_TIMEOUT: 3000, // ms
  DEFAULT_VOLUME: 0.3,
  GAMEPLAY: {
    PLAYER_SPEED: 40,
    PLAYER_HEIGHT: 2,
    JUMP: 20,
    GRAVITY: 40,
    SHOTS_SPEED: 50,
  },
  MODELS: [
    { x: -2, y: -2 },
    { x: -2, y: -1 },
    { x: -1, y: -2 },
    { x: -2, y: -3 },
    { x: -1, y: -1 },
  ],
  UPDATE_TIME: 400,
  EFFECT_TIME: 1500,
};

// Игровые расы
export const RacesConfig = {
  [Races.human]: {
    box: { x: 0.6, y: 1.8, z: 0.75 },
    isWeapon: true,
  },
  [Races.reptiloid]: {
    box: { x: 0.6, y: 1.8, z: 0.75 },
    isWeapon: true,
  },
  [Races.bidens]: {
    box: { x: 4.5, y: 9.7, z: 3 },
    isWeapon: false,
  },
  [Races.mutant]: {
    box: { x: 4, y: 5, z: 2.5 },
    isWeapon: false,
  },
  [Races.orc]: {
    box: { x: 2, y: 3.6, z: 1.5 },
    isWeapon: false,
  },
  [Races.zombie]: {
    box: { x: 0.6, y: 1.9, z: 0.75 },
    isWeapon: false,
  },
  [Races.soldier]: {
    box: { x: 0.6, y: 1.8, z: 0.75 },
    isWeapon: true,
  },
  [Races.cyborg]: {
    box: { x: 1.2, y: 2.8, z: 1.1 },
    isWeapon: true,
  },
};

// Экранный помощник
export const ScreenHelper = (() => {
  const DESKTOP = DESIGN.BREAKPOINTS.desktop;

  const isDesktop = () => {
    return window.matchMedia(`(min-width: ${DESKTOP}px)`).matches;
  };

  const isBro = () => {
    const isChrome =
      /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isYandex = navigator.userAgent.search(/YaBrowser/) > 0;
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    return isChrome || isYandex || isFirefox;
  };

  return {
    isDesktop,
    isBro,
  };
})();

// Переводы

export const MESSAGES: TMessages = {
  [Languages.en]: {
    enter: 'Enter',
    name: 'The whole world is in ruins',
    nick: 'Your nickname:',
    nick2: '(Only latin)',
    select: 'Select your race:',
    gadgetsgate: 'The game is for desktop browsers only!',
    chromegate:
      'In order to play, open in the Google Chrome (or Yandex) browser (Firefox not recommended)',
    startbutton: 'Play',
    restartbutton: 'Restart',
    control1: 'Shot: Left mouse button',
    control2: 'Move: WASD',
    control3: 'Jump: Space + WASD',
    control4: 'Run: Shift + W',
    control5: 'Hidden movement: C or Alt',
    control6: 'Look: Mouse (If it stops working, press P and select “Play”)',
    // control7: 'Take a thing / Open door : E',
    control8: 'Optical sight: Right mouse button',
    control9: 'Map: M',
    control10: 'Menu: P',
    control11: 'Action: E',
    copyright: '© Levon Gambaryan Bro Games',
    gameover: 'Game Over',

    hiddenMoveEnabled: 'You move in stealth mode',
    hiddenMoveDisabled: 'Stealth mode disabled',
    tired: 'Your is tired of running',
    recovered: 'Your can run again',
    exitOn: 'You are at the exit from the location!',
    exitOff: 'Exit from a location far away',

    door: 'Press E to open the door',
    point: 'Raise your race\'s flag at the control station?',
    pointStart: 'The flag cannot be changed at this point!',
    pointGood: 'The point already belongs to your race!',
    pick: 'Pick: ',

    [Races.human]: 'Russian',
    [Races.reptiloid]: 'Reptiloid',
    [Races.bidens]: 'Bidens',
    [Races.zombie]: 'Feminist',
    [Races.mutant]: 'Narcomutant',
    [Races.orc]: 'Alcoork',
    [Races.soldier]: 'NATO soldier',
    [Races.cyborg]: 'Putin\'s cyborg',
  },
  [Languages.ru]: {
    enter: 'Играть',
    nick: 'Тебя зовут:',
    nick2: '(Только латиницей, к сожалению)',
    select: 'Выбери свою сторону:',
    name: 'Весь мир в труху',
    gadgetsgate: 'Игра только для десктопных браузеров!',
    chromegate:
      'Для того чтобы играть откройте в браузере Google Chrome (или Яндекс), Firefox не рекомендуется',
    startbutton: 'Играть',
    restartbutton: 'Cначала',
    control1: 'Выстрел: Левая кнопка мыши',
    control2: 'Движение: WASD',
    control3: 'Прыжок: Space + WASD',
    control4: 'Бежать: Shift + W',
    control5: 'Cкрытное передвижение (меньше урон): C или Alt',
    control6: 'Осмотреться: Мышь (Если перестало работать - нажмите P и выберите Играть)',
    // control7: 'Взять предмет / Открыть дверь: Е',
    control8: 'Оптический прицел: Правая кнопка мыши',
    control9: 'Карта: M',
    control10: 'Меню: P',
    control11: 'Действие: E',
    copyright: '© Levon Gambaryan Bro Games',
    gameover: 'Проиграл',

    hiddenMoveEnabled: 'Вы двигаетесь в скрытном режиме',
    hiddenMoveDisabled: 'Скрытный режим отключен',
    tired: 'Вы устали от бега',
    recovered: 'Вы снова можете бегать',
    exitOn: 'Вы на выходе с локации!',
    exitOff: 'Выход с локации далеко',

    door: 'Нажмите E для того чтобы открыть дверь',
    point: 'Поднять флаг своей расы на контрольной точке?',
    pointStart: 'На этой точке нельзя поменять флаг!',
    pointGood: 'Точка уже принадлежит вашей расе!',
    pick: 'Подобрать: ',

    [Races.human]: 'Выживший',
    [Races.reptiloid]: 'Рептилоид',
    [Races.bidens]: 'Байденс',
    [Races.zombie]: 'Феминистка',
    [Races.mutant]: 'Наркомутант',
    [Races.orc]: 'Алкоорк',
    [Races.soldier]: 'Натовец',
    [Races.cyborg]: 'Киборг Путина',
  },
};
