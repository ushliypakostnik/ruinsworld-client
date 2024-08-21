import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import { store, key } from './store';
import emitter from '@/utils/emitter';

// Websockets
import VueSocketIO from 'vue-3-socket.io';

// Constants
import { LANGUAGES, MESSAGES, API_URL } from '@/utils/constants';

// Translate
const i18n = createI18n({
  legacy: true,
  locale: store.getters['persist/language']
    ? store.getters['persist/language']
    : LANGUAGES[0],
  fallbackLocale: LANGUAGES[0],
  messages: MESSAGES,
});

// Websockets
const socketio = new VueSocketIO({
  debug: false,
  connection: API_URL,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  cors: {
    origin: '*',
    methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS'],
    credentials: false,
  },
});

const app = createApp(App).use(i18n).use(store, key).use(socketio);
app.config.globalProperties.emitter = emitter; // Add emmiter
app.mount('#app');
