import { Module } from 'vuex';

// Types
import type { IStore, IStoreModule, TFieldPayload } from '@/models/store';

const initialState: IStoreModule = () => ({
  id: null,
  name: null,
  isEnter: false, // Cервер знает имя и расу пользователя?

  language: null,
  isPause: true, // Сейчас пауза?
  isGameOver: false, // Умер?
  messages: [], // Сообщения сейчас

  // Gameplay
  endurance: 100,
  isHide: false,
  isRun: false,
  isJump: false,
  isTired: false,
  day: 0,
});
const initial = initialState;

const persist: Module<IStoreModule, IStore> = {
  namespaced: true,
  state: initial,

  getters: {
    id: (state: IStoreModule) => state.id,
    name: (state: IStoreModule) => state.name,
    isEnter: (state: IStoreModule) => state.isEnter,
    language: (state: IStoreModule) => state.language,
    isPause: (state: IStoreModule) => state.isPause,
    endurance: (state: IStoreModule) => state.endurance,
    isHide: (state: IStoreModule) => state.isHide,
    isRun: (state: IStoreModule) => state.isRun,
    isJump: (state: IStoreModule) => state.isJump,
    isTired: (state: IStoreModule) => state.isTired,
    isGameOver: (state: IStoreModule) => state.isGameOver,
    day: (state: IStoreModule) => state.day,
  },

  actions: {
    setPersistState: (context, payload: TFieldPayload): void => {
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

    restart: ({ commit }): void => {
      commit('restart');
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
    },

    reload: (state: IStoreModule): void => {
      state.name = initial.name;
      state.isEnter = initial.isEnter;
      state.isPause = initial.isPause;
      state.endurance = initial.endurance;
      state.isHide = initial.isHide;
      state.isRun = initial.isRun;
      state.isJump = initial.isJump;
      state.isTired = initial.isTired;
      state.isGameOver = initial.isGameOver;
    },
  },
};

export default persist;
