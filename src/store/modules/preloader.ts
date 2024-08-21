import { Module } from 'vuex';

// Types
import type { IStore, IPreloader } from '@/models/store';

// API
import { Races } from '@/utils/constants';

const FLAG = 'isGameLoaded';

let stateCopy;
let result;

const initialState: IPreloader = {
  [`${FLAG}`]: false,

  // Textures
  concretteIsLoaded: false,
  concrette2IsLoaded: false,
  metallIsLoaded: false,
  metall2IsLoaded: false,
  fireIsLoaded: false,
  glassIsLoaded: false,

  // Models
  weaponEnemiesIsLoaded: false,
  weaponHeroIsLoaded: false,
  weaponNPCIsLoaded: false,

  [`${Races.human}IsLoaded`]: false,
  [`${Races.reptiloid}IsLoaded`]: false,

  // Для теста - выключить в ложь тестируюемую
  [`${Races.bidens}IsLoaded`]: Number(process.env.VUE_APP_TEST_MODE) ? true : false, 
  [`${Races.mutant}IsLoaded`]: Number(process.env.VUE_APP_TEST_MODE) ? true : false, 
  [`${Races.orc}IsLoaded`]: Number(process.env.VUE_APP_TEST_MODE) ? true : false, 
  [`${Races.zombie}IsLoaded`]: Number(process.env.VUE_APP_TEST_MODE) ? true : false, 
  [`${Races.soldier}IsLoaded`]: Number(process.env.VUE_APP_TEST_MODE) ? true : false, 
  [`${Races.cyborg}IsLoaded`]: Number(process.env.VUE_APP_TEST_MODE) ? true : false, 

  // Audio

  // World
  windIsLoaded: false,

  // Players
  stepsIsLoaded: false,
  jumpstartIsLoaded: false,
  jumpendIsLoaded: false,
  hitIsLoaded: false,
  deadIsLoaded: false,

  // Weapon
  shotIsLoaded: false,
  explosionIsLoaded: false,

  // NPC

  // Zombie
  zombieidleIsLoaded: false,
  zombiehitIsLoaded: false,
  zombiedeadIsLoaded: false,

  // Bidens
  bidensidleIsLoaded: false,
  bidenshitIsLoaded: false,
  bidensdeadIsLoaded: false,

  // Mutant
  mutantdeadIsLoaded: false,
  mutantjumpendIsLoaded: false,
  mutanthitIsLoaded: false,
  mutantidleIsLoaded: false,
  mutantstepsIsLoaded: false,

  // Orc
  orcidleIsLoaded: false,
  orchitIsLoaded: false,
  orcdeadIsLoaded: false,

  // Soldier
  soldieridleIsLoaded: false,
  soldierhitIsLoaded: false,
  soldierdeadIsLoaded: false,

  // Cyborg
  cyborgidleIsLoaded: false,
  cyborghitIsLoaded: false,
  cyborgdeadIsLoaded: false,
  cyborgstepsIsLoaded: false,

  // World build
  heroIsBuild: false,
  worldIsBuild: false,
};

const preloader: Module<IPreloader, IStore> = {
  namespaced: true,
  state: initialState,

  getters: {
    isGameLoaded: (state: IPreloader) => state[FLAG],
  },

  actions: {
    preloadOrBuilt: ({ commit }, field: string): void => {
      commit('preloadOrBuilt', field);
    },

    isAllLoadedAndBuild: ({ commit }): void => {
      commit('isAllLoadedAndBuild');
    },
  },

  mutations: {
    preloadOrBuilt: (state: IPreloader, field: string) => {
      state[field] = true;
    },

    isAllLoadedAndBuild: (state: IPreloader) => {
      stateCopy = Object.assign({}, state);
      delete stateCopy[FLAG];
      result = Object.values(stateCopy).every((field) => field === true);
      if (result) {
        state[FLAG] = true;
      }
    },
  },
};

export default preloader;
