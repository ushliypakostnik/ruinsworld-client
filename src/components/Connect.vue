<template>
  <div />
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions, mapMutation } from 'vuex';

// Constants
import { EmitterEvents } from '@/models/api';
import { DESIGN, Picks } from '@/utils/constants';

// Services
import emitter from '@/utils/emitter';

export default {
  name: 'Connect',

  data() {
    return {
      timeout: null,
      counter: DESIGN.UPDATE_TIME,
    };
  },

  sockets: {
    connect: () => {
      // console.log('socket connected');
    },

    // Ответ сервера на соединение
    onConnect: () => {
      // console.log('Connect sockets onConnect');
      emitter.emit(EmitterEvents.onConnect);
    },

    // Новый игрок
    newPlayer: () => {
      // console.log('Connect sockets newPlayer!!!');
      emitter.emit(EmitterEvents.newPlayer);
    },

    // Подтверждение старого игрока
    onUpdatePlayer: (player) => {
      // console.log('Connect sockets onUpdatePlayer', player);
      emitter.emit(EmitterEvents.onUpdatePlayer, player);
    },

    // Реакция на заход в игру
    onEnter: (id) => {
      // console.log('Connect sockets onEnter', id);
      emitter.emit(EmitterEvents.onEnter, id);
    },

    // Пришло обновление
    updateToClients: (game) => {
      // console.log('Connect sockets updateToClients', game);
      emitter.emit(EmitterEvents.updateToClients, game);
    },

    // Реакция на ответ на выстрел
    onShot: (shot) => {
      // console.log('Connect sockets onShot', shot);
      emitter.emit(EmitterEvents.onShot, shot);
    },

    // Реакция на ответ на удаление выстрела
    onUnshot: (id) => {
      // console.log('Connect sockets onUnshot', id);
      emitter.emit(EmitterEvents.onUnshot, id);
    },

    // Реакция на ответ на взрыв
    onExplosion: (updates) => {
      // console.log('Connect sockets onExplosion', updates);
      emitter.emit(EmitterEvents.onUnshot, updates.message.id);
      emitter.emit(EmitterEvents.onExplosion, updates.message);
      emitter.emit(EmitterEvents.hits, updates.updates);
    },

    // Реакция на ответ на самоповреждение
    onSelfharm: (message) => {
      // console.log('Connect sockets onSelfharm', message);
      emitter.emit(EmitterEvents.onSelfharm, message);
    },

    onRelocation: (id) => {
      // console.log('Connect sockets onRelocation', id);
      emitter.emit(EmitterEvents.onRelocation, id);
    },

    onPick: (message) => {
      // console.log('Connect sockets onPick', message);
      emitter.emit(EmitterEvents.onPick, message);
    },

    onPoint: (message) => {
      // console.log('Connect sockets onPoint', message);
      emitter.emit(EmitterEvents.onPoint, message);
    },

    onUse: (message) => {
      // console.log('Connect sockets onUse', message);
      emitter.emit(EmitterEvents.onUse, message);
    },

    onSend: (message) => {
      // console.log('Connect sockets onSend', message);
      emitter.emit(EmitterEvents.onSend, message);
    },
  },

  computed: {
    ...mapGetters({
      game: 'api/game',
      updates: 'api/updates',
      location: 'api/location',
      locationIndex: 'api/locationIndex',

      config: 'persist/config',
      id: 'persist/id',
      name: 'persist/name',
      race: 'persist/race',
      isHide: 'persist/isHide',
      isRun: 'persist/isRun',
      isPause: 'persist/isPause',
      isGameOver: 'persist/isGameOver',
      isEnter: 'persist/isEnter',
      toxic: 'persist/toxic',
      food: 'persist/food',
      water: 'persist/water',

      isReload: 'not/isReload',
    }),
  },

  created() {
    // Запрашиваем конфигурацию геймплея
    this.getConfig();

    // Среагировать на ответ сервера на соединение
    this.emitter.on(EmitterEvents.onConnect, () => {
      // console.log('Connect created onConnect!');
      this.$socket.emit(EmitterEvents.onOnConnect, { id: this.id });
      this.onConnect();
    });

    // Новый игрок
    this.emitter.on(EmitterEvents.newPlayer, () => {
      // console.log('Connect created newPlayer!');
      this.onNewPlayer();
    });

    // Реагировать на подтверждение старого игрока
    this.emitter.on(EmitterEvents.onUpdatePlayer, (player) => {
      // console.log('Connect created onUpdatePlayer', player);
      this.onUpdatePlayer(player);
    });

    // Реагировать на вход нового игрока
    this.emitter.on(EmitterEvents.enter, (message) => {
      // console.log('Connect created enter', id);
      this.$socket.emit(EmitterEvents.enter, {
        id: this.id,
        name: message.name,
        race: message.race,
        location: message.location,
      });
    });

    // Реагировать на отклик о входе в игру
    this.emitter.on(EmitterEvents.onEnter, (player) => {
      // console.log('Connect created onEnter');
      this.onEnter(player);
    });

    // Реагировать на переиграть
    this.emitter.on(EmitterEvents.reenter, () => {
      // console.log('Connect created reenter');
      this.$socket.emit(EmitterEvents.reenter, {
        id: this.id,
      });
    });

    // Реагировать на обновления
    this.emitter.on(EmitterEvents.updateToClients, (game) => {
      // console.log('Connect created updateToClients', game);
      this.updateToClients(game);
    });

    // Отправить обновления
    this.emitter.on(EmitterEvents.updateToServer, (updates) => {
      // console.log('Connect created updateToServer', updates);
      this.sendUpdates(updates);
    });

    // Запускаем регулярную отправку обновлений на сервер
    this.timeout = setInterval(() => {
      if (!this.isGameOver && !this.isReload)
        this.sendUpdates(this.getUpdates());
    }, Number(process.env.VUE_APP_TIMEOUT) || 25);

    // Реагировать на выстрел
    this.emitter.on(EmitterEvents.shot, (shot) => {
      // console.log('Connect created shot', shot);
      this.shot(shot);
    });

    // Реагировать на удаление выстрела
    this.emitter.on(EmitterEvents.unshot, (id) => {
      // console.log('Connect created unshot', id);
      this.unshot(id);
    });

    // Реагировать на взрыв
    this.emitter.on(EmitterEvents.explosion, (message) => {
      // console.log('Connect created explosion', message);
      this.explosion(message);
    });

    // Реагировать на обновления об уроне при взрывах
    this.emitter.on(EmitterEvents.hits, (updates) => {
      // console.log('Connect created hits', updates);
      this.onExplosion(updates);
    });

    // Реагировать на самоповреждения
    this.emitter.on(EmitterEvents.selfharm, (value) => {
      // console.log('Connect created selfharm', value);
      this.onSelfharm(value);
    });

    // Реагировать на ответ на самоповреждения
    this.emitter.on(EmitterEvents.onSelfharm, (message) => {
      // console.log('Connect created onSelfharm', message);
      this.onOnSelfharm(message);
    });

    // Переход на другую локацию
    this.emitter.on(EmitterEvents.relocation, (direction) => {
      // console.log('Connect created relocation', direction);
      this.relocation(direction);
    });

    // Игрок загрузился на локации
    this.emitter.on(EmitterEvents.location, () => {
      // console.log('Connect created location');
      this.$socket.emit(EmitterEvents.location, this.id);
    });

    // Игрок поставил флаг на контрольной точке
    this.emitter.on(EmitterEvents.point, (payload) => {
      // console.log('Connect created point', payload);
      this.$socket.emit(EmitterEvents.point, { ...payload, race: this.race });
    });

    // Игрок поставил флаг на контрольной точке
    this.emitter.on(EmitterEvents.onPoint, (payload) => {
      // console.log('Connect created onPoint', payload);
      this.onPoint(payload);
    });

    // Игрок умер
    this.emitter.on(EmitterEvents.userDead, (payload) => {
      // console.log('Connect created userDead', payload);
      this.$socket.emit(EmitterEvents.userDead, payload);
    });

    // Игрок подобрал что-то
    this.emitter.on(EmitterEvents.pick, (payload) => {
      // console.log('Connect created pick', payload);
      this.$socket.emit(EmitterEvents.pick, payload);
    });

    // На ответ на подобрал что-то
    this.emitter.on(EmitterEvents.onPick, (payload) => {
      // console.log('Connect created onPick', payload);
      this.onPick(payload);
    });

    // Игрок применил вещь
    this.emitter.on(EmitterEvents.use, (payload) => {
      // console.log('Connect created use', payload);
      this.$socket.emit(EmitterEvents.use, payload);
    });

    // На ответ на применил вещь
    this.emitter.on(EmitterEvents.onUse, (payload) => {
      // console.log('Connect created use', payload);
      this.onUse(payload);
    });

    // Игрок отправил сообщение в чат
    this.emitter.on(EmitterEvents.send, (payload) => {
      // console.log('Connect created send', payload);
      this.$socket.emit(EmitterEvents.send, {
        name: this.name,
        race: this.race,
        location: this.locationIndex,
        text: payload,
      });
    });
  },

  beforeDestroy() {
    clearInterval(this.timeout);
  },

  methods: {
    ...mapActions({
      setApiState: 'api/setApiState',
      onUseAction: 'api/onUse',
      setPersistState: 'persist/setPersistState',
      getConfig: 'persist/getConfig',
    }),

    // Произошло соединение с сервером
    onConnect() {
      console.log('Connect: запускаем процесс!!!');
    },

    // Новый игрок
    onNewPlayer(player) {
      this.setPersistState({
        field: 'isEnter',
        value: false,
      });
    },

    // На подтверждение старого игрока
    onUpdatePlayer(player) {
      // console.log('Connect onUpdatePlayer', player);
      if (this.isEnter) {
        // Устанавливаем позицию игрока
        this.setStart(player);

        // Установливаем локацию
        this.setApiState({
          field: 'location',
          value: player.location,
        }).then(() => {
          this.setApiState({
            field: 'health',
            value: player.health,
          }).then(() => {
            this.setApiState({
              field: 'exp',
              value: player.exp,
            });
          });
        });
      }
    },

    // Заход в игру
    onEnter(player) {
      // console.log('Connect onEnter', player);
      this.setPersistState({
        field: 'id',
        value: player.id,
      }).then(() => {
        // Устанавливаем позицию игрока
        this.setStart(player);

        // Установливаем локацию и запускаем игру
        this.setApiState({
          field: 'location',
          value: player.location,
        }).then(() => {
          this.setPersistState({
            field: 'isPause',
            value: false,
          }).then(() => {
            this.setPersistState({
              field: 'isEnter',
              value: true,
            });
          });
        });
      });
    },

    // Установка стартовых значений игрока
    setStart(player) {
      this.setApiState({
        field: 'start',
        value: {
          positionX: player.positionX,
          positionY: player.positionY,
          positionZ: player.positionZ,
          directionX: player.directionX,
          directionY: player.directionY,
          directionZ: player.directionZ,
        },
      });
    },

    // Постоянные обновления от сервера
    updateToClients(game) {
      // console.log('Connect updateToClients!!!', game);
      this.setApiState({
        field: 'game',
        value: game,
      });
    },

    // Отобрать обновления для отправки
    getUpdates() {
      // console.log('Connect getUpdates!!!');
      ++this.counter;
      if (this.counter > DESIGN.UPDATE_TIME) {
        this.counter = 0;
        return {
          ...JSON.parse(JSON.stringify(this.updates)),
          time: Math.round(new Date().getTime() / 1000),
        };
      }
      return JSON.parse(JSON.stringify(this.updates));
    },

    // Отправить обновления серверу
    sendUpdates(updates) {
      if (!this.isPause) {
        this.setApiState({
          field: 'updates',
          value: {},
        }).then(() => {
          this.$socket.emit(EmitterEvents.updateToServer, {
            id: this.id,
            ...updates,
          });
        });
      }
    },

    // Выстрел
    shot(shot) {
      // console.log('Connect shot()', shot);
      if (shot) this.$socket.emit(EmitterEvents.shot, shot);
    },

    // Выстрел улетел
    unshot(id) {
      // console.log('Connect unshot()', id);
      this.$socket.emit(EmitterEvents.unshot, id);
    },

    // Взрыв
    explosion(message) {
      // console.log('Connect explosion()', message);
      this.$socket.emit(EmitterEvents.explosion, message);
    },

    // На подьем флага
    onPoint(payload) {
      if (this.id === payload.id) {
        this.setApiState({
          field: 'exp',
          value: payload.exp,
        });
      }
    },

    // На ответ на взрыв - прилетел урон?
    onExplosion(updates) {
      // console.log('Connect onExplosion()', updates);
      const user = updates.users.find((player) => player.id === this.id);
      if (user) {
        if (user.health > 0) {
          this.setApiState({
            field: 'isOnHit',
            value: true,
          }).then(() => {
            if (user.is)
              this.setApiState({
                field: 'isOnBodyHit',
                value: true,
              });

            setTimeout(() => {
              this.setApiState({
                field: 'isOnHit',
                value: false,
              }).then(() => {
                if (user.is)
                  this.setApiState({
                    field: 'isOnBodyHit',
                    value: false,
                  });
              });
            }, DESIGN.HIT_TIMEOUT);
          });
        }

        this.setApiState({
          field: 'health',
          value: user.health,
        });
      }

      const users = updates.users
        .filter((player) => player.is)
        .map((player) => {
          return player.id;
        });
      const npc = updates.npc
        .filter((unit) => unit.is)
        .map((unit) => {
          return unit.id;
        });

      if (users.length + npc.length > 0) {
        this.setApiState({
          field: 'isOnHitOthers',
          value: true,
        });
        this.setApiState({
          field: 'onHitOthers',
          value: {
            users,
            npc,
          },
        });
      }
    },

    // Самоповреждение
    onSelfharm(value) {
      // console.log('Connect onSelfharm()', value);
      this.$socket.emit(EmitterEvents.selfharm, {
        id: this.id,
        location: this.location,
        value,
      });
      this.setApiState({
        field: 'isOnHit',
        value: true,
      }).then(() => {
        setTimeout(() => {
          this.setApiState({
            field: 'isOnHit',
            value: false,
          });
        }, DESIGN.HIT_TIMEOUT);
      });
    },

    // На самоповреждение
    onOnSelfharm(message) {
      // console.log('Connect onOnSelfharm()', message, this.id);
      if (message.id === this.id) {
        this.setApiState({
          field: 'health',
          value: message.health,
        });
      }
    },

    // Переход на другую локацию
    relocation(direction) {
      this.$socket.emit(EmitterEvents.relocation, {
        id: this.id,
        location: this.location,
        direction,
      });
    },

    // Реагировать на ответ на подбор
    onPick(message) {
      // console.log('Connect onPick()', message);
      // Если это клиент который забрал вещь - устанавливаем опыт
      this.$socket.emit(EmitterEvents.onOnPick, message);
      if (this.id === message.user) {
        if (message.exp)
          this.setApiState({
            field: 'exp',
            value: message.exp,
          });

        if (message.type === Picks.dead) {
          this.setPersistState({
            field: 'toxic',
            value: this.toxic + this.config.races[message.target].toxic,
          });
        }
      }
    },

    // На ответ на применение вещи
    onUse(message) {
      // console.log('Connect onUse()', message);
      // Если это клиент который использовал вещь - устанавливаем опыт
      if (this.id === message.user) this.onUseAction(message);
    },
  },
};
</script>
