<template>
  <div id="scene" class="scene"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, watch, reactive } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';

import * as THREE from 'three';

// Constants
import { Audios, Colors, DESIGN, Things } from '@/utils/constants';

// Emmiter
import emitter from '@/utils/emitter';

// Types
import { EmitterEvents } from '@/models/api';
import type { ISelf, KeysState } from '@/models/modules';
import type {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  AudioListener,
} from 'three';

// Modules
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import Helper from '@/utils/helper';
import Assets from '@/utils/assets';
import Events from '@/utils/events';
import AudioBus from '@/utils/audio';
import World from '@/components/Scene/World';
import Octree from '@/components/Scene/World/Math/Octree';

// Stats
import Stats from 'three/examples/jsm/libs/stats.module';

export default defineComponent({
  name: 'Scene',

  props: ['size'],

  setup(props) {
    const store = useStore(key);

    // console.log('Scene: ', props.size);

    // Core

    let container: HTMLElement;

    let camera: PerspectiveCamera = new THREE.PerspectiveCamera();
    let listener: AudioListener = new THREE.AudioListener();

    let scene: Scene = new THREE.Scene();

    let renderer: WebGLRenderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    // Controls
    let controls: PointerLockControls = new PointerLockControls(
      camera,
      renderer.domElement,
    );

    // Helpers
    let helper: Helper = new Helper();
    let assets: Assets = new Assets();
    let events: Events = new Events();
    let audio: AudioBus = new AudioBus();

    // Modules
    let world = new World();

    // Functions
    let init: () => void;
    let animate: () => void;
    let render: () => void;
    let onWindowResize: () => void;
    let onKeyDown: (event: KeyboardEvent) => void;
    let onKeyUp: (event: KeyboardEvent) => void;
    let onMouseDown: (event: MouseEvent) => void;
    let onMouseUp: (event: MouseEvent) => void;

    // Store getters
    const isEnter = computed(() => store.getters['persist/isEnter']);
    const isLocationLoadedAndBuild = computed(
      () => store.getters['location/isLocationLoadedAndBuild'],
    );
    const isGameOver = computed(() => store.getters['persist/isGameOver']);
    const isPause = computed(() => store.getters['persist/isPause']);
    const isHide = computed(() => store.getters['persist/isHide']);
    const isRun = computed(() => store.getters['persist/isRun']);
    const isOptical = computed(() => store.getters['not/isOptical']);
    const isMap = computed(() => store.getters['not/isMap']);
    const isHelp = computed(() => store.getters['not/isHelp']);
    const isChat = computed(() => store.getters['not/isChat']);
    const location = computed(() => store.getters['api/location']);
    const text = computed(() => store.getters['not/text']);

    // Utils
    const keys: KeysState = reactive({});

    // Stats
    let stats = Stats();

    // Go!
    init = () => {
      // Core
      container = document.getElementById('scene') as HTMLElement;

      // Camera
      camera = new THREE.PerspectiveCamera(
        DESIGN.CAMERA.fov,
        container.clientWidth / container.clientHeight,
        0.1,
        props.size * 0.75,
      );

      // Audio listener
      camera.add(listener);

      // Scene
      scene.background = new THREE.Color(Colors.sky);
      scene.fog = new THREE.Fog(
        DESIGN.CAMERA.fog,
        props.size / 10,
        props.size * 3,
      );
      self.scene = scene;
      self.render = render;

      // Renderer
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      // Controls
      controls = new PointerLockControls(camera, renderer.domElement);
      controls.addEventListener('unlock', () => {
        if (!isHelp.value && !isChat.value && !isMap.value) {
          store.dispatch('persist/setPersistState', {
            field: 'isPause',
            value: true,
          });
        }
      });
      if (isPause.value || isGameOver.value) controls.unlock();
      else controls.lock();

      // Listeners
      window.addEventListener('resize', onWindowResize, false);
      document.addEventListener('keydown', (event) => onKeyDown(event), false);
      document.addEventListener('keyup', (event) => onKeyUp(event), false);
      document.addEventListener(
        'mousedown',
        (event) => onMouseDown(event),
        false,
      );
      document.addEventListener('mouseup', (event) => onMouseUp(event), false);

      // Реагировать на ответ на выстрел
      emitter.on(EmitterEvents.onShot, (shot) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        world.onShot(self, shot);
      });

      // container.appendChild(stats.dom);

      // First render
      onWindowResize();
    };

    // Клавиша клавиатуры нажата
    onKeyDown = (event) => {
      keys[event.code] = true;
    };

    // Клавиша клавиатуры отпущена
    onKeyUp = (event) => {
      keys[event.code] = false;

      // console.log('Scene onKeyUp code: ', event.keyCode);

      switch (event.keyCode) {
        case 49: // 1
          if (
            isEnter.value &&
            !isGameOver.value &&
            !isPause.value &&
            !isChat.value &&
            !isHelp.value
          ) {
            if (store.getters['persist/vodka'] > 0) {
              store.dispatch('persist/setPersistState', {
                field: 'vodka',
                value: store.getters['persist/vodka'] - 1,
              });
              emitter.emit(EmitterEvents.use, {
                user: store.getters['persist/id'],
                thing: Things.vodka,
                location: location.value,
              });
              self.helper.pickDispatchHelper(self);
            } else self.audio.replayHeroSound(Audios.click);
          }
          break;

        case 50: // 2
          if (
            isEnter.value &&
            !isGameOver.value &&
            !isPause.value &&
            !isChat.value &&
            !isHelp.value
          ) {
            if (store.getters['persist/stew'] > 0) {
              store.dispatch('persist/setPersistState', {
                field: 'stew',
                value: store.getters['persist/stew'] - 1,
              });
              emitter.emit(EmitterEvents.use, {
                user: store.getters['persist/id'],
                thing: Things.stew,
                location: location.value,
              });
              self.helper.pickDispatchHelper(self); 
            } else self.audio.replayHeroSound(Audios.click);
          }
          break;

        case 16: // Shift
          if (
            isEnter.value &&
            !isGameOver.value &&
            !isPause.value &&
            isRun.value &&
            !isChat.value
          )
            store.dispatch('persist/setPersistState', {
              field: 'isRun',
              value: false,
            });
          break;

        case 80: // P
          if (
            isEnter.value &&
            !isGameOver.value &&
            !isHelp.value &&
            !isMap.value &&
            !isChat.value
          )
            store.dispatch('persist/setPersistState', {
              field: 'isPause',
              value: !isPause.value,
            });
          break;

        case 77: // M
          if (
            isEnter.value &&
            !isPause.value &&
            !isHelp.value &&
            !isChat.value &&
            !isGameOver.value
          )
            store.dispatch('not/setNotState', {
              field: 'isMap',
              value: !isMap.value,
            });
          break;

        case 72: // H
          if (
            isEnter.value &&
            !isPause.value &&
            !isMap.value &&
            !isChat.value &&
            !isGameOver.value
          )
            store.dispatch('not/setNotState', {
              field: 'isHelp',
              value: !isHelp.value,
            });
          break;

        case 82: // R
          if (
            isEnter.value &&
            !isPause.value &&
            !isMap.value &&
            !isHelp.value &&
            !isGameOver.value &&
            !isChat.value
          ) {
            store.dispatch('not/setNotState', {
              field: 'isChat',
              value: true,
            });
          }
          break;

        case 17: // Cntr
          if (
            isEnter.value &&
            !isPause.value &&
            !isMap.value &&
            !isHelp.value &&
            !isGameOver.value &&
            isChat.value
          ) {
            store.dispatch('not/setNotState', {
              field: 'isChat',
              value: false,
            });
          }
          break;

        case 13: // Enter
          if (
            isEnter.value &&
            !isPause.value &&
            !isMap.value &&
            !isHelp.value &&
            !isGameOver.value &&
            isChat.value &&
            text.value.length
          ) {
            emitter.emit(EmitterEvents.send, text.value);
            store.dispatch('not/setNotState', {
              field: 'isSendByEnter',
              value: true,
            });
          }
          break;

        case 67: // C
        case 18: // Alt
          if (
            isEnter.value &&
            !isGameOver.value &&
            !isPause.value &&
            !isChat.value &&
            !isHelp.value
          ) {
            self.audio.replayHeroSound(Audios.jumpstart);
            store.dispatch('persist/setPersistState', {
              field: 'isHide',
              value: !isHide.value,
            });
          }
          break;
        default:
          break;
      }
    };

    // Нажата клавиша мыши
    onMouseDown = (event) => {
      if (
        isEnter.value &&
        !isPause.value &&
        !isHelp.value &&
        !isChat.value &&
        !isGameOver.value &&
        event.button === 0
      )
        emitter.emit(EmitterEvents.shot, world.shot(self));

      if (
        isEnter.value &&
        !isPause.value &&
        !isGameOver.value &&
        event.button === 2 &&
        !isOptical.value &&
        !isHelp.value &&
        !isChat.value
      )
        store.dispatch('not/setNotState', {
          field: 'isOptical',
          value: true,
        });
    };

    // Отпущена клавиша мыши
    onMouseUp = (event) => {
      if (
        isEnter.value &&
        !isPause.value &&
        !isGameOver.value &&
        event.button === 2 &&
        isOptical.value
      )
        store.dispatch('not/setNotState', {
          field: 'isOptical',
          value: false,
        });
    };

    animate = () => {
      if (isLocationLoadedAndBuild.value && isEnter.value) {
        events.animate();
        world.animate(self);
      }

      render();

      stats.update();

      requestAnimationFrame(animate);
    };

    onWindowResize = () => {
      self.camera.aspect = window.innerWidth / window.innerHeight;
      self.camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    render = () => {
      renderer.render(self.scene, self.camera);
      // console.log('Renderer info: ', renderer.info.memory.geometries, renderer.info.memory.textures, renderer.info.render);
    };

    // This is self )
    let self: ISelf = {
      // Utils
      helper,
      assets,
      events,
      audio,

      // math
      octree: new Octree(),
      octree2: new Octree(),
      octree3: new Octree(),
      octree4: new Octree(),

      // state
      keys,

      // Core
      store,
      scene,
      camera,
      listener,
      render,
    };

    self.camera.fov = DESIGN.CAMERA.fov;

    // Следим за паузой
    watch(
      () => store.getters['persist/isPause'],
      (value) => {
        if (value) controls.unlock();
        else controls.lock();

        // Если c паузы - выключаем оптику
        if (!value && isOptical.value) {
          store.dispatch('not/setNotState', {
            field: 'isOptical',
            value: false,
          });
        }

        // Если на паузу - карту
        if (value && isMap.value) {
          store.dispatch('not/setNotState', {
            field: 'isMap',
            value: false,
          });
        }
      },
    );

    // Следим за помощью
    watch(
      () => store.getters['not/isHelp'],
      (value) => {
        if (value) controls.unlock();
        else controls.lock();
      },
    );

    // Следим за подсказкой
    watch(
      () => store.getters['not/isChat'],
      (value) => {
        if (value) controls.unlock();
        else controls.lock();
      },
    );

    // Следим за концом игры
    watch(
      () => store.getters['persist/isGameOver'],
      (value) => {
        setTimeout(() => {
          controls.unlock();
        }, Number(process.env.VUE_APP_TIMEOUT) || 75);

        // Если c оптики - выключаем оптику
        if (!value && isOptical.value) {
          store.dispatch('not/setNotState', {
            field: 'isOptical',
            value: false,
          });
        }

        // Если c подсказки - выключаем подсказку
        if (value && isHelp.value) {
          store.dispatch('not/setNotState', {
            field: 'isHelp',
            value: false,
          });
        }

        // Если c чата - выключаем чат
        if (value && isChat.value) {
          store.dispatch('not/setNotState', {
            field: 'isChat',
            value: false,
          });
        }

        // Если c карты - выключаем карту
        if (value && isMap.value) {
          store.dispatch('not/setNotState', {
            field: 'isMap',
            value: false,
          });
        }
      },
    );

    // Следим за оптикой
    watch(
      () => store.getters['not/isOptical'],
      (value) => {
        if (value) self.camera.fov = DESIGN.CAMERA.fov / 4;
        else self.camera.fov = DESIGN.CAMERA.fov;
        self.camera.updateProjectionMatrix();
      },
    );

    // Следим за скрытным режимом
    watch(
      () => store.getters['persist/isHide'],
      (value) => {
        if (value) {
          self.events.messagesByIdDispatchHelper(self, 'hiddenMoveEnabled');
        } else
          self.events.messagesByIdDispatchHelper(self, 'hiddenMoveDisabled');
      },
    );

    // Следим за усталостью
    watch(
      () => store.getters['persist/isTired'],
      (value) => {
        if (value && isRun.value)
          store.dispatch('persist/setPersistState', {
            field: 'isRun',
            value: false,
          });
        if (value) self.events.messagesByIdDispatchHelper(self, 'tired');
        else self.events.messagesByIdDispatchHelper(self, 'recovered');
      },
    );

    // Запускаем рендер когда все самое необходимое загрузилось
    watch(
      () => store.getters['preloader/isGameLoaded'],
      (value) => {
        emitter.emit(EmitterEvents.location);
        if (value) {
          animate();

          // Фикс "первого прыжка"
          setTimeout(() => {
            store.dispatch('not/setNotState', {
              field: 'isStart',
              value: true,
            });
          }, 500);
        }
      },
    );

    // Следим за локацией
    watch(
      () => store.getters['api/location'],
      (value) => {
        if (value) {
          store.dispatch('api/getLocation', value);
        }
      },
    );

    // Следим за подзагрузкой
    watch(
      () => store.getters['location/isLocationLoadedAndBuild'],
      (value) => {
        if (value) {
          world.upgrade(self);
        }
      },
    );

    // Следим за данными локации
    watch(
      () => store.getters['api/locationData'],
      (value) => {
        if (value) {
          // Init modules
          assets.init(self);
          audio.init(self);
          world.init(self);
        }
      },
    );

    // Следим за уроном игрокам и NPC
    watch(
      () => store.getters['api/isOnHitOthers'],
      (value) => {
        if (value) {
          world.onHit(self, store.getters['api/onHitOthers']);
          store.dispatch('api/setApiState', {
            field: 'isOnHitOthers',
            value: false,
          });
        }
      },
    );

    onMounted(() => {
      init();
    });
  },
});
</script>

<style lang="stylus">
.scene
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  width 100vw
  height: 100vh
</style>
