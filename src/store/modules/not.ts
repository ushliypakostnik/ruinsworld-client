import { Module } from 'vuex';

// Types
import type {
  IStore,
  IStoreModule,
  TEventMessagePayload,
  TFieldPayload,
} from '@/models/store';

const initialState: IStoreModule = {
  isOptical: false,
  isMap: false,
  messages: [], // Сообщения сейчас
  isReload: false, // Перед принудительной перезагрузкой
};

let array: Array<TEventMessagePayload> = [];

const not: Module<IStoreModule, IStore> = {
  namespaced: true,
  state: initialState,

  getters: {
    isOptical: (state: IStoreModule) => state.isOptical,
    isMap: (state: IStoreModule) => state.isMap,
    messages: (state: IStoreModule) => state.messages,
    isReload: (state: IStoreModule) => state.isReload,
  },

  actions: {
    setNotState: ({ commit }, payload: TFieldPayload): void => {
      commit('setNotState', payload);
    },

    showMessage: ({ commit }, payload: TEventMessagePayload): void => {
      commit('showMessage', payload);
    },

    hideMessage: ({ commit }, payload: number): void => {
      commit('hideMessage', payload);
    },
  },

  mutations: {
    setNotState: (state: IStoreModule, payload: TFieldPayload): void => {
      state[payload.field] = payload.value;
    },

    showMessage: (state: IStoreModule, payload: TEventMessagePayload): void => {
      array = state.messages;
      array.push(payload);
      state.messages = array;
    },

    hideMessage: (state: IStoreModule, payload: number): void => {
      array = state.messages.filter(
        (message: TEventMessagePayload) => message.id !== payload,
      );
      state.messages = array;
    },
  },
};

export default not;
