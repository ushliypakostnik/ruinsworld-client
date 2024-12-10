import { Module } from 'vuex';

// API
import { APIService } from '@/utils/api';

// Types
import type { IStore, IStoreModule, TFieldPayload } from '@/models/store';
import { Races } from '@/utils/constants';

const initialState: IStoreModule = () => ({
  config: null, // Конфигурация геймплея - неписей и предметов
  day: 0, // Время суток
  id: null, // Идентификатор игрока
  name: null, // Имя игрока
  isEnter: false, // Cервер знает имя и расу пользователя?
  race: Races.human, // Раса которую пользователь выбрал последний раз
  last: null, // Последняя локация на которую заходил игрок
  isExit: false, // Рядом с выходом на другую локацию?

  language: null, // Язык интерфейса
  isPause: true, // Сейчас пауза?
  isGameOver: false, // Умер?
  messages: [], // Сообщения сейчас

  // Gameplay
  endurance: 100, // Выносливость
  food: 100, // Запас пищи
  water: 100, // Запас воды
  toxic: 10, // Отравление
  isHide: false, // Скрытый режим?
  isRun: false, // Бег?
  isJump: false, // В прыжке?
  isTired: false, // Устал?

  // Things
  grenades: 50,
  vodka: 0,
  stew: 0,
});
const initial = initialState;

const persist: Module<IStoreModule, IStore> = {
  namespaced: true,
  state: initial,

  getters: {
    config: (state: IStoreModule) => state.config,
    id: (state: IStoreModule) => state.id,
    name: (state: IStoreModule) => state.name,
    isEnter: (state: IStoreModule) => state.isEnter,
    isExit: (state: IStoreModule) => state.isExit,
    language: (state: IStoreModule) => state.language,
    isPause: (state: IStoreModule) => state.isPause,
    endurance: (state: IStoreModule) => state.endurance,
    food: (state: IStoreModule) => state.food,
    water: (state: IStoreModule) => state.water,
    toxic: (state: IStoreModule) => state.toxic,
    isHide: (state: IStoreModule) => state.isHide,
    isRun: (state: IStoreModule) => state.isRun,
    isJump: (state: IStoreModule) => state.isJump,
    isTired: (state: IStoreModule) => state.isTired,
    isGameOver: (state: IStoreModule) => state.isGameOver,
    day: (state: IStoreModule) => state.day,
    race: (state: IStoreModule) => state.race,
    last: (state: IStoreModule) => state.last,
    grenades: (state: IStoreModule) => state.grenades,
    vodka: (state: IStoreModule) => state.vodka,
    stew: (state: IStoreModule) => state.stew,
  },

  actions: {
    setPersistState: (context, payload: TFieldPayload): void => {
      // Смерть от жажды, голода или отравления
      if (
        ((payload.field === 'food' || payload.field === 'water') &&
          payload.value <= 0) ||
        (payload.field === 'toxic' && payload.value >= 100)
      )
        context.dispatch('setPersistState', {
          field: 'isGameOver',
          value: true,
        });

      if (
        payload.field === 'endurance' &&
        context.getters.endurance < 1 &&
        !context.getters.isTired
      )
        context.commit('setPersistState', { field: 'isTired', value: true });
      else if (
        payload.field === 'endurance' &&
        context.getters.endurance > 100 &&
        context.getters.isTired
      )
        context.commit('setPersistState', { field: 'isTired', value: false });
      else context.commit('setPersistState', payload);
    },

    getConfig: ({ commit }): void => {
      APIService.getConfig().then((res) => {
        commit('getConfig', res);
      });
    },

    onUse: ({ commit }, payload): void => {
      commit('onUse', payload);
    },

    reload: ({ commit }): void => {
      commit('reload');
    },
  },

  mutations: {
    setPersistState: (state: IStoreModule, payload: TFieldPayload): void => {
      if (payload.field === 'endurance') {
        if (state[payload.field] < 100 && payload.value > 0)
          state[payload.field] += payload.value;
        else if (state[payload.field] > 100 && payload.value > 0)
          state[payload.field] = 100;
        else state[payload.field] += payload.value;
      } else state[payload.field] = payload.value;

      if (payload.field === 'toxic') {
        if (state.toxic > 100) state.toxic = 100;
        else if (state.toxic < 0) state.toxic = 0;
      }
    },

    onUse: (state: IStoreModule, payload): void => {
      // console.log('onUse persist store mutation: ', payload);
      state.toxic += state.config.things[payload].toxic;
      if (state.toxic > 100) state.toxic = 100;
      else if (state.toxic < 0) state.toxic = 0;
      state.water += state.config.things[payload].water;
      if (state.water > 100) state.water = 100;
      else if (state.water < 0) state.water = 0;
      state.food += state.config.things[payload].food;
      if (state.food > 100) state.food = 100;
      else if (state.food < 0) state.food = 0;
    },

    getConfig: (state: IStoreModule, payload): void => {
      // console.log('getConfig persist store mutation: ', payload);
      state.config = payload;
    },

    reload: (state: IStoreModule): void => {
      state.isEnter = initial.isEnter;
      state.isPause = initial.isPause;
      state.endurance = initial.endurance;
      state.food = initial.food;
      state.water = initial.water;
      state.toxic = initial.toxic;
      state.isHide = initial.isHide;
      state.isRun = initial.isRun;
      state.isJump = initial.isJump;
      state.isTired = initial.isTired;
      state.isGameOver = initial.isGameOver;
      state.grenades = state.config?.things?.grenades?.start;
      state.vodka = initial.vodka;
      state.stew = initial.stew;
    },
  },
};

export default persist;
