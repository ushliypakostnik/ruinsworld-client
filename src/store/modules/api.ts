import { Module } from 'vuex';

// API
import { APIService } from '@/utils/api';

// Types
import type { IStore, IStoreModule, TFieldPayload } from '@/models/store';
import type { IGameUpdates } from '@/models/api';

const initialState: IStoreModule = () => ({
  start: null, // Стартовые данные игрока и мира
  location: null, // Идентификатор локации
  locationData: null, // Данные локации
  game: null, // Данные игры
  updates: {}, // Обновления
  health: 100, // Не менять на null!!!
  isOnHit: false, // Под ударом?
  isOnBodyHit: false,
  onHitOthers: { users: [], npc: [] },
  isOnHitOthers: false,
  map: null, // Данные карты
  exp: 0, // Опыт
});
const initial = initialState;

const api: Module<IStoreModule, IStore> = {
  namespaced: true,
  state: initial,

  getters: {
    start: (state: IStoreModule) => state.start,
    location: (state: IStoreModule) => state.location,
    locationData: (state: IStoreModule) => state.locationData,
    locationIndex: (state: IStoreModule) => state.locationData.index,
    game: (state: IStoreModule) => state.game,
    updates: (state: IStoreModule) => state.updates,
    health: (state: IStoreModule) => state.health,
    isOnHit: (state: IStoreModule) => state.isOnHit,
    isOnBodyHit: (state: IStoreModule) => state.isOnBodyHit,
    onHitOthers: (state: IStoreModule) => state.onHitOthers,
    isOnHitOthers: (state: IStoreModule) => state.isOnHitOthers,
    map: (state: IStoreModule) => state.map,
    exp: (state: IStoreModule) => state.exp,
  },

  actions: {
    setApiState: ({ commit, dispatch }, payload: TFieldPayload): void => {
      // Смерть от того что кончилось здоровье
      if (payload.field === 'health' && payload.value < 0)
        dispatch(
          'persist/setPersistState',
          { field: 'isGameOver', value: true },
          { root: true },
        );

      commit('setApiState', payload);
    },

    getLocation: ({ commit }, id): void => {
      APIService.getLocation(id).then((res) => {
        commit('getLocation', res);
      });
    },

    getMap: ({ commit }, id): void => {
      APIService.getMap(id).then((res) => {
        commit('getMap', res);
      });
    },

    clearMap: ({ commit }): void => {
      commit('clearMap');
    },

    onUse: ({ commit, dispatch }, payload): void => {
      commit('onUse', payload);
      dispatch('persist/onUse', payload.thing, { root: true });
    },

    reload: ({ commit }): void => {
      commit('reload');
    },

    // Websockets

    SOCKET_onConnect({ commit }, payload: IGameUpdates) {
      commit('SOCKET_onConnect', payload);
    },
  },

  mutations: {
    setApiState: (state: IStoreModule, payload: TFieldPayload): void => {
      if (payload.field === 'updates') {
        if (!payload.value) state[payload.field] = {};
        else
          state[payload.field] = {
            ...state[payload.field],
            ...payload.value,
          };
      } else state[payload.field] = payload.value;

      if (payload.field === 'isOnHitOthers' && !payload.value)
        state.onHitOthers = initialState.onHitOthers;
    },

    getLocation: (state: IStoreModule, payload): void => {
      // console.log('getLocation api store mutation: ', payload);
      state.locationData = payload;
    },

    getMap: (state: IStoreModule, payload): void => {
      // console.log('getMap api store mutation: ', payload);
      state.map = payload;
    },

    clearMap: (state: IStoreModule): void => {
      // console.log('clearMap api store mutation: ', payload);
      state.map = initial.map;
    },

    onUse: (state: IStoreModule, payload): void => {
      // console.log('onUse api store mutation: ', payload);
      state.health = payload.health;
      state.exp = payload.exp;
    },

    reload: (state: IStoreModule): void => {
      state.start = initial.start;
      state.location = initial.location;
      state.locationData = initial.locationData;
      state.game = initial.game;
      state.updates = initial.updates;
      state.health = initial.health;
      state.isOnHit = initial.isOnHit;
      state.isOnBodyHit = initial.isOnBodyHit;
      state.onHitOthers = initial.onHitOthers;
      state.isOnHitOthers = initial.isOnHitOthers;
      state.map = initial.map;
    },

    // Websockets

    SOCKET_onConnect: (state: IStoreModule, payload: IGameUpdates): void => {
      state.game = payload;
    },
  },
};

export default api;
