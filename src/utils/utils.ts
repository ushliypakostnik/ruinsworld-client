import type { Store } from 'vuex';
import type { State } from '@/store';

// Помощник перезагрузки
export const restartDispatchHelper = (store: Store<State>): void => {
  store
    .dispatch('not/setNotState', {
      field: 'isReload',
      value: true,
    }).then(() => {
      store.dispatch('persist/setPersistState', {
        field: 'isEnter',
        value: false,
      }).then(() => {
        store.dispatch('persist/reload').then(() => {
          store.dispatch('api/reload').then(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.location.reload(true);
          });
        });
      });
    });
};

// Помощник перехода на другую локацию
export const relocationDispatchHelper = (store: Store<State>): void => {
  store
    .dispatch('not/setNotState', {
      field: 'isReload',
      value: true,
    }).then(() => {
      store.dispatch('api/reload').then(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.location.reload(true);
      });
    });
};
