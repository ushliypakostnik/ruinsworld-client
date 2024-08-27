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
  message: null, // "Постоянное" cообщение сейчас
  content: null, // Контент постоянного сообщения
  messages: [], // Короткие сообщения сейчас
  isReload: false, // Перед принудительной перезагрузкой
  isPick: false, // Подбор предмета
};

let array: Array<TEventMessagePayload> = [];

const not: Module<IStoreModule, IStore> = {
  namespaced: true,
  state: initialState,

  getters: {
    isOptical: (state: IStoreModule) => state.isOptical,
    isMap: (state: IStoreModule) => state.isMap,
    message: (state: IStoreModule) => state.message,
    content: (state: IStoreModule) => state.content,
    messages: (state: IStoreModule) => state.messages,
    isReload: (state: IStoreModule) => state.isReload,
    isPick: (state: IStoreModule) => state.isPick,
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

    showPermanentMessage: ({ commit }, payload: TEventMessagePayload): void => {
      commit('showPermanentMessage', payload);
    },

    hidePermanentMessage: ({ commit }, payload: number): void => {
      commit('hidePermanentMessage', payload);
    },

    showPermanentMessageWithContent: (
      { commit },
      payload: TEventMessagePayload,
    ): void => {
      commit('showPermanentMessageWithContent', payload);
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

    showPermanentMessage: (state: IStoreModule, payload: string): void => {
      state.message = payload;
    },

    hidePermanentMessage: (state: IStoreModule): void => {
      state.message = null;
      state.content = null;
    },

    showPermanentMessageWithContent: (
      state: IStoreModule,
      payload: { message: string; content: string },
    ): void => {
      state.message = payload.message;
      state.content = payload.content;
    },
  },
};

export default not;
