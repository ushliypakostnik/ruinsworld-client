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
  // bidens = 'bidens',
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
  things = 'things',
}

export enum Modes {
  idle = 'idle',
  active = 'active',
  dead = 'dead',
}

export enum Picks {
  dead = 'dead',
  thing = 'thing',
}

export enum Damages {
  kick = 'kick',
  light = 'light',
  shot = 'shot',
}

export enum Moves {
  right = 'right',
  left = 'left',
  top = 'top',
  bottom = 'bottom',
}

export enum Things {
  grenades = 'grenades',
  vodka = 'vodka',
  stew = 'stew',

  // Rare
  go = 'go',
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
  ground2 = 'ground2',
  concrette = 'concrette',
  concrette2 = 'concrette2',
  glass = 'glass',
  glassspecial = 'glassspecial',
  metallDark = 'metallDark',
  metall = 'metall',
  metall2 = 'metall2',
  fire = 'fire',
  purple = 'purple',
  light = 'light',
  pseudo = 'pseudo',
  scale = 'scale',
  hole = 'hole',
  blood = 'blood',
  grass = 'grass',
  playerred = 'playerred',
  playerblue = 'playerblue',
  vodka = 'vodka',
  go = 'go',
  zone = 'zone',
  trash = 'trash',
  road = 'road',
  yellow = 'yellow',
  wood = 'wood',
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
  click = 'click',
  gosong = 'gosong',

  // Weapon
  explosion = 'explosion',
  light = 'light',
  
  // NPC

  // Zombie
  zombieidle = 'zombieidle',
  zombiehit = 'zombiehit',
  zombiedead = 'zombiedead',
  
  // Bidens
  // bidensidle = 'bidensidle',
  // bidenshit = 'bidenshit',
  // bidensdead = 'bidensdead',

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
  // cyborghit = 'cyborghit',
  // cyborgdead = 'cyborgdead',
  // cyborgsteps = 'cyborgsteps',
  // cyborgidle = 'cyborgidle',
}

export enum Colors {
  white = 0xffffff,
  black = 0x000000,
  yellow = 0xfed564,
  yellowDark = 0xe6a800,
  fog = 0xa48ed8,
  sun = 0xfdb813,
  toruch = 0xffff99,
  sky = 0x77deac,
  metall = 0x999999,
  metall2 = 0xaa9999,
  fire = 0xff6666,
  scale = 0x681a13,
  glass = 0xaaaaaa,
  blood = 0x8d0000,
  grass = 0x0aaf09,
  red = 0xff0000,
  blue = 0x0000ff,
  bluelight = 0x00bfff,

  concrette = 0x6f6f6f,
  stones =  0x3f1f0f, // северо-восток
  stones2 = 0x1f0f1f, // юго-восток
  stones3 = 0x4f4f4f, // северо-запад
  stones4 = 0xa0a0f0, // юго-запад
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
  BREAKPOINTS: {
    desktop: 1025,
  },
  SIZE: 300,
  CAMERA: {
    fov: 80,
    fog: Colors.fog,
  },
  HIT_TIMEOUT: 500, // ms
  MESSAGES_TIMEOUT: 3000, // ms
  DEFAULT_VOLUME: 0.3,
  GAMEPLAY: {
    PLAYER_SPEED: 20,
    PLAYER_HEIGHT: 2,
    JUMP: 20,
    GRAVITY: 40,
    SHOTS_SPEED: 50,
  },
  UPDATE_TIME: 100,
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
  /*
  [Races.bidens]: {
    box: { x: 4.5, y: 9.7, z: 3 },
    isWeapon: false,
  }, */
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
    box: { x: 0.6, y: 1.8, z: 0.75 },
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
    race: 'Select your race:',
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
    control7: 'Optical sight: Right mouse button',
    control8: 'Help: H',
    control9: 'Map: M',
    control10: 'Menu: P',
    control11: 'Action: E',
    control12: 'Chat: R',
    link: 'Join the community on telegram',
    copyright: '© Levon Gambaryan Bro Games',
    gameover: 'Game Over',

    help1: 'Plot and basic rules',
    help2: 'Controls and dials',
    help3: 'NPC',
    help4: 'Items',
    help5: 'Features',
    help6: 'Author',

    feature1: '* Several types of different weapons. Not only grenades, but also quick-fire and laser ones. Mines.',
    feature2: '* Flying NPCs. Drones protecting locations from players. And birds for hunting.',
    feature3: '* More items. Modifier items for a more interesting battle.',

    author: 'Levon Alekseevich Gambaryan',

    history: 'In preparation for the invasion, advanced Reptilian emissaries were embedded in the leadership of TNCs, investment funds and the US Democratic Party. They unleashed a nuclear war, and in a few hours of gunfire, the whole Earth was turned into a poisoned desert, and the cities into ruins. A couple hundred years have passed and many living beings have mutated into toxic monsters aimlessly loitering among the ruins and waging a race war against everyone. The main forces of the Reptiles also landed on the planet to finish what they started. You can play either as Human Survivors, rebels resisting final colonization, or as alien invaders.',
    rule1: 'In the center of each location there are control points and shelters. You can set and change flags on them. If you died in a location that already belongs to your race, then you will be reborn on it. Otherwise - at the original command post of the race, where the flag cannot be changed.',
    rule2: 'The speed of control depends on the character’s health level and the degree of his poisoning. Players cannot fire heavy weapons while moving or jumping. If you throw a grenade launcher shell at your feet, you will die.',
    rule3: 'Now the magic and energy weapons of the NPCs are breaking through the walls. Players with a low level should not be careful and not allow themselves to be hit with a long-range shot.',
    rule4: 'Be careful when moving between locations. It’s better to stock up on stewed meat and vodka - you can go straight into a poisoned area or be attacked by the nepis walking there.',

    scale11: 'Red scale',
    scale12: 'shows the character\'s health level.',
    scale21: 'Purple scale',
    scale22: 'shows the level of fatigue. If you are tired, you cannot jump or run until it recovers.',
    scale31: 'Blue scale',
    scale32: 'shows your water supply. Look for wells (blue dots on the map) to fill your flask.',
    scale41: 'Green scale',
    scale42: 'shows your food supply.',
    scale51: 'Yellow scale',
    scale52: 'shows the level of poisoning.',
    scalemore: 'To the right of the scales there are icons for quick access to items (press keys 1 ... 0 to apply), indicators of their current and maximum quantity in the backpack. In the right corner you see the number of available charges for weapons, as well as their maximum number that can be collected.',

    friendnpc: 'Helps one of the game races!',
    nonplayersracestext: 'As time passes, units gain experience. When picking up their corpses, players receive experience points and poisoning relative to it. Regeneration in older individuals slows down. Putin\'s cyborgs help the Rebels, have increased intelligence (responsible for visibility and speed of decision-making), and agile NATO members accept the Reptilians as a new power and order on the planet.',
    things: 'Items',
    thingstext: 'Some items, such as shots for weapons, are “applied” immediately when picked up. Others - you can dial a limited number and use them via shortcut keys whenever it is convenient for you.',
    thingsrare: 'Rare Items',

    enemy: 'Enemies',
    important: 'Important enemies',
    friend: 'Ally',
    kick: 'Melee',
    attack: 'Ranged combat',
    regeneration: 'Regeneration',
    intelligence: 'Intelligence',
    armor: 'Armor',
    exp: 'Gives experience when selecting',
    toxic: 'Causes poison when picked up',
    speed: 'Speed',
    health: 'Gives health when used',
    exp2: 'Reduces experience when used',
    toxic2: 'Poison when used',
    food: 'Food when used',
    water: 'Water when used',
    numbers: 'Contains units',
    max: 'Maximum quantity',

    hiddenMoveEnabled: 'You move in stealth mode.',
    hiddenMoveDisabled: 'Stealth mode disabled.',
    tired: 'Your is tired of running.',
    recovered: 'Your can run again.',
    exitOn: 'You are at the exit from the location!',
    exitOff: 'Exit from a location far away.',
    foodlow: 'You need to eat!',
    waterlow: 'You need to find water!',
    toxichight: 'You need to reduce poisoning',
    full: 'There\'s already too much of this item!',
    well: 'Fill the flask with water!',
    toxiczone: 'You are in a poisoned area!',

    door: 'Press E to open the door.',
    point: 'Raise your race\'s flag at the control station?',
    pointStart: 'The flag cannot be changed at this point!',
    pointGood: 'The point already belongs to your race!',
    pick: 'Pick: ',

    chat: 'Enter - send a message, Ctrl - close the chat.',
    close: 'Close chat',
    send: 'Send message',

    [Races.human]: 'Red commander',
    [Races.reptiloid]: 'Reptiloid',
    [Races.zombie]: 'Radfeministka',
    [Races.mutant]: 'Narcomutant',
    [Races.orc]: 'Alcoork',
    [Races.soldier]: 'NATO soldier',
    [Races.cyborg]: 'Red soldier',

    [Things.grenades]: 'Grenades',
    [Things.vodka]: 'Vodka',
    [Things.stew]: 'Stew',
    [Things.go]: 'Worn Civil Defense CD',
  },
  [Languages.ru]: {
    enter: 'Играть',
    nick: 'Тебя зовут:',
    nick2: '(Только латиницей, к сожалению)',
    race: 'Выбери свою сторону:',
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
    control7: 'Оптический прицел: Правая кнопка мыши',
    control8: 'Подсказка: H',
    control9: 'Карта: M',
    control10: 'Меню: P',
    control11: 'Действие: E',
    control12: 'Чат: R',
    link: 'Присоединяйся к сообществу в телеграм',
    copyright: '© Levon Gambaryan Bro Games',
    gameover: 'Проиграл',

    help1: 'Фабула и правила',
    help2: 'Управление и шкалы',
    help3: 'Неписи',
    help4: 'Предметы',
    help5: 'Планы разработки',
    help6: 'Автор',

    feature1: '* Несколько видов разного оружия. Не только гранаты - быстрострельное и лазерное. Мины.',
    feature2: '* Летающие неписи. Охраняющие локации от игроков дроны. Птицы для охоты.',
    feature3: '* Больше предметов. Предметы-модификаторы для более интересного боя.',

    history: 'В рамках подготовки к вторжению, передовые эмиссары Рептилоидов были внедрены в руководство ТНК, инвестиционных фондов и Демократической партии США. Они развязали ядерную войну, и за несколько часов перестрелки вся Земля была превращена в отравленную пустыню, а города в руины. Прошло пара сотен лет и многие живые существа мутировали в токсичных монстров, бесцельно слоняющихся среди развалин, и ведущих расовую войну все против всех. На планету также высадились основные силы Рептилов, чтобы довершить начатое. Вы можете играть или за выживших людей, повстанцев, сопротивляющихся окончательной колонизации, или за инопланетных захватчиков.',
    rule1: 'В центре каждой локации есть контрольные точки, укрытия. На них можно устанавливать и менять флаги. Если вы погибли на локации которая уже принадлежит вашей расе - то переродитесь на ней. В противном случае - на исходном командном пункте расы, на котором нельзя поменять флаг.',
    rule2: 'Cкорость контрола зависит от уровня здоровья персонажа и степени его отравления. Игроки не могут стрелять из тяжелого оружия когда перемешаются или прыгают. Если вы кинете из гранатомета себе снаряд под ноги, то погибнете.',
    rule3: 'Сейчас магия и энергетическое оружие неписей - пробивают сквозь стены. Игрокам с низким уровнем, стоит быть осторожнее, и не доводить до удара дальним по себе.',
    rule4: 'Будьте внимательными при переходе между локациями. Лучше запаситесь тушенкой и водкой - вы можете перейти прямо в отравленную местность или под удар прогуливающейся там неписи.',

    author: 'Левон Алексеевич Гамбарян',

    scale11: 'Красная шкала',
    scale12: 'показывает уровень здоровья персонажа.',
    scale21: 'Фиолетовая шкала',
    scale22: 'показывает уровень усталости. Если вы устали - вы не можете прыгать и бегать пока она не востановится.',
    scale31: 'Голубая шкала',
    scale32: 'показывает ваш запас воды. Ищите колодцы (голубые точки на карте) для того чтобы наполнить флягу.',
    scale41: 'Зеленая шкала',
    scale42: 'показывает ваш запас пищи.',
    scale51: 'Желтая шкала',
    scale52: 'показывает уровень отравления.',
    scalemore: 'Справа от шкал располагаются пиктограммы быстрого доступа к предметам (нажмите клавиши 1 ... 0 чтобы применить), индикаторы их актуального и максимального количества в рюкзаке. В правом углу вы видете количество имеющихся зарядов для оружия, а также их маскимальное количество которое можно собрать.',

    friendnpc: 'Помогает одной из игровых рас!',
    nonplayersracestext: 'С ходом времени юниты получают опыт. При подборе их трупов игроки получают очки опыта и отравление относительно него. Регенерация у более старых особей - замедляется. Киборги Путина помогают Повстанцам, имеют повышенный интеллект (отвечает за обзор и скорость принятия решений), а проворные Натовцы - принимают Рептилоидов как новую власть, порядок на планете.',
    things: 'Предметы',
    thingstext: 'Некоторые предметы, например, выстрелы к оружию, "применяются" сразу при подборе. Другие - можно набирать некоторое ограниченное количество и применять через клавиши быстрого доступа когда вам удобно.',
    thingsrare: 'Редкие предметы',

    enemy: 'Враги',
    important: 'Особенно ненавидит',
    friend: 'Союзник',
    kick: 'Ближний бой',
    attack: 'Дальний бой',
    regeneration: 'Регенерация',
    intelligence: 'Интеллект',
    armor: 'Броня',
    exp: 'Дает опыта при подборе',
    toxic: 'Вызывает отравление при подборе',
    speed: 'Скорость',
    health: 'Дает здоровья при применении',
    exp2: 'Отнимает опыта при применении',
    toxic2: 'Отравление при применении',
    food: 'Еда при применении',
    water: 'Вода при применении',
    numbers: 'Содержит единиц',
    max: 'Максимальное количество',

    hiddenMoveEnabled: 'Вы двигаетесь в скрытном режиме.',
    hiddenMoveDisabled: 'Скрытный режим отключен.',
    tired: 'Вы устали от бега.',
    recovered: 'Вы снова можете бегать.',
    exitOn: 'Вы на выходе с локации!',
    exitOff: 'Выход с локации далеко.',
    foodlow: 'Вам необходимо поесть!',
    waterlow: 'Вам необходимо найти воду!',
    toxichight: 'Вам необходимо снизить отравление!',
    full: 'Этого предмета уже слишком много!',
    well: 'Наполнить флягу водой!',
    toxiczone: 'Вы находитесь в отравленной местности!',

    door: 'Нажмите E для того чтобы открыть дверь.',
    point: 'Поднять флаг своей расы на контрольной точке?',
    pointStart: 'На этой точке нельзя поменять флаг!',
    pointGood: 'Точка уже принадлежит вашей расе!',
    pick: 'Подобрать: ',

    chat: 'Enter - отправить сообщение, Ctrl - закрыть чат.',
    close: 'Закрыть',
    send: 'Отправить',

    [Races.human]: 'Красный коммандир',
    [Races.reptiloid]: 'Рептилоид',
    [Races.zombie]: 'Радфеминистка',
    [Races.mutant]: 'Наркомутант',
    [Races.orc]: 'Алкоорк',
    [Races.soldier]: 'Натовец',
    [Races.cyborg]: 'Красный солдат',

    [Things.grenades]: 'Гранаты',
    [Things.vodka]: 'Водка',
    [Things.stew]: 'Тушенка',
    [Things.go]: 'Потертый CD Гражданской Обороны',
  },
};
