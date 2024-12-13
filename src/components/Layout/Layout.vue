<template>
  <div
    v-if="isDesktop && isBro"
    class="layout"
    :class="{ 'layout--dead': isGameOver && isEnter }"
  >
    <Preloader>
      <Connect />

      <Scene />

      <template v-if="!isEnter">
        <div class="layout__enter">
          <div class="layout__overlay layout__overlay--enter" />
          <div class="layout__effect" />

          <div class="layout__dialog">
            <div class="layout__header layout__header--noenter">
              {{ $t('name') }}
            </div>
            <div v-if="config" class="layout__version">v{{ config.version }}</div>

            <LangSwitch />

            <div class="layout__title">{{ $t('race') }}</div>

            <div
              class="layout__race"
              :class="{
                'layout__race--human': race === Races.human,
                'layout__race--reptiloid': race === Races.reptiloid,
              }"
            >
              <div @click="setRace(Races.human)">
                <div />
              </div>
              <div @click="setRace(Races.reptiloid)">
                <div />
              </div>
            </div>

            <div class="layout__title">{{ $t('nick') }}</div>
            <div class="layout__nick">{{ $t('nick2') }}</div>
            <input
              class="layout__input"
              v-model="nickname"
              maxlength="25"
              @input="filter"
            />

            <div class="layout__buttons">
              <button
                class="layout__button layout__button--enter"
                :class="{
                  'layout__button--disabled':
                    !nickname || nickname.length === 0,
                }"
                type="button"
                @click.prevent.stop="enter"
              >
                {{ $t('enter') }}
              </button>
            </div>

            <div class="layout__link">
              {{ $t('link') }}:
              <a href="https://t.me/ruinsworld" target="__blank"
                >t.me/ruinsworld</a
              >
            </div>
            <div class="layout__copy">
              <p>{{ $t('copyright') }}</p>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="layout__optical-preload" />
        <div class="layout__optical" v-if="isOptical">
          <div class="layout__optical--side" />
          <div class="layout__optical--center" />
          <div class="layout__optical--side" />
        </div>

        <div class="layout__scales">
          <div class="layout__scales-item layout__scales-item--vodka">
            <div class="layout__scales-item-icon">
              <svg
                id="_Слой_1"
                data-name="Слой 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 89.5 140"
              >
                <path
                  d="m76.85,39.21h-20.56V0h-23.09v39.21H12.64c-6.98,0-12.64,5.66-12.64,12.64v75.5c0,6.98,5.66,12.64,12.64,12.64h64.21c6.98,0,12.64-5.66,12.64-12.64V51.86c0-6.98-5.66-12.64-12.64-12.64Z"
                  style="fill: #fff; stroke-width: 0px"
                />
              </svg>
              <div>1</div>
            </div>
            <div class="layout__scales-item-number">
              {{ vodka }}
            </div>
            <div class="layout__scales-item-max" v-if="config">
              ({{ config.things.vodka.max }})
            </div>
          </div>

          <div class="layout__scales-item layout__scales-item--stew">
            <div class="layout__scales-item-icon">
              <svg
                id="_Слой_1"
                data-name="Слой 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 269 487.5"
              >
                <path
                  d="m0,74v2.5c0-.84.05-1.67.14-2.5h-.14Z"
                  style="fill: #fff; stroke-width: 0px"
                />
                <path
                  d="m268.86,74c.09.83.14,1.66.14,2.5v-2.5h-.14Z"
                  style="fill: #fff; stroke-width: 0px"
                />
                <path
                  d="m268.86,54C265.75,23.96,206.79,0,134.5,0S3.25,23.96.14,54c-.09.83-.14,1.66-.14,2.5,0,31.2,60.22,56.5,134.5,56.5s134.5-25.3,134.5-56.5c0-.84-.05-1.67-.14-2.5Z"
                  style="fill: #fff; stroke-width: 0px"
                />
                <path
                  d="m134.5,133C60.22,133,0,107.7,0,76.5v354.5c0,31.2,60.22,56.5,134.5,56.5s134.5-25.3,134.5-56.5V76.5c0,31.2-60.22,56.5-134.5,56.5Z"
                  style="fill: #fff; stroke-width: 0px"
                />
              </svg>
              <div>2</div>
            </div>
            <div class="layout__scales-item-number">
              {{ stew }}
            </div>
            <div class="layout__scales-item-max" v-if="config">
              ({{ config.things.stew.max }})
            </div>
          </div>

          <Scale face="health" :progress="!isGameOver && health ? health : 0" />

          <Scale
            face="endurance"
            :progress="endurance"
            :lock="isTired && !isGameOver"
            :not="isTired && !isGameOver"
          />
          <Scale face="food" :progress="food" :not="food < 25 && !isGameOver" />
          <Scale
            face="water"
            :progress="water"
            :not="water < 25 && !isGameOver"
          />
          <Scale
            face="toxic"
            :progress="toxic"
            :not="toxic > 75 && !isGameOver"
          />
        </div>

        <div v-if="config" class="layout__ammo">
          <div
            class="layout__ammo-scale"
            :class="{
              'layout__ammo-scale--disabled': isMove || !isNotJump,
            }"
          >
            <Scale face="weapon" :progress="(shotTime * 100 / 1.5) > 100 ? 100 : (shotTime * 100 / 1.5)" />
          </div>
          {{ grenades }}<span>({{ config.things[Things.grenades].max }})</span>
        </div>

        <div
          v-if="isPick"
          class="layout__overlay layout__overlay--light effect"
        />
        <div
          class="layout__overlay layout__overlay--dark"
          :key="keyHealth"
          :style="` opacity: ${health >= 0 ? (100 - health) / 200 : 0.5}`"
        />
        <div
          class="layout__overlay layout__overlay--hit"
          :key="keyHealth"
          :style="` opacity: ${health >= 0 ? (100 - health) / 200 : 0.5}`"
        />
        <div
          class="layout__overlay"
          :class="[
            isOnHit && !isGameOver && `layout__overlay--hit hit`,
            isGameOver && 'layout__overlay--hit',
          ]"
        />

        <transition-group name="fade2" tag="ul" class="layout__messages">
          <li class="layout__message" v-if="message">
            {{ $t(`${message}`) }}
            <span v-if="content">{{ $t(`${content}`) }}</span>
          </li>

          <li
            class="layout__message"
            v-for="(message, index) in messages"
            :key="`message${index}`"
          >
            {{ $t(`${message.text}`) }}
          </li>
        </transition-group>

        <div class="layout__name">
          {{ name }}
          <span :style="`white-space: nowrap`">/ {{ exp }} ({{ level }})</span>
        </div>
        <div v-if="locationData" class="layout__location">
          {{ locationData.name[language] }} ({{ locationData.index }})
        </div>

        <Map class="layout__map" v-if="isMap && !isReload" />

        <Help class="layout__help" v-if="isHelp && !isReload" />

        <Chat class="layout__chat" v-if="isChat && !isReload" />

        <div class="layout__effect" />

        <transition name="fade">
          <div
            v-if="(isPause && isGameLoaded) || isGameOver"
            class="layout__blocker"
            :class="{ 'layout__blocker--pause': !isGameOver }"
          >
            <div class="layout__header">
              {{ !isGameOver ? $t('name') : $t('gameover') }}
            </div>
            <div v-if="!isGameOver" class="layout__version">
              v{{ config.version }}
            </div>

            <LangSwitch v-if="!isGameOver" />

            <div class="layout__buttons">
              <button
                v-if="!isGameOver"
                class="layout__button"
                type="button"
                @click.prevent.stop="play"
              >
                {{ $t('startbutton') }}
              </button>

              <button
                class="layout__button layout__button--enter"
                :class="{ 'layout__button--dead': isGameOver }"
                type="button"
                @click.prevent.stop="reenter"
              >
                {{ $t('restartbutton') }}
              </button>
            </div>

            <div v-if="!isGameOver" class="layout__keys-wrapper">
              <div class="layout__keys">{{ $t('control8') }}</div>
              <div class="layout__keys">{{ $t('control9') }}</div>
              <div class="layout__keys">{{ $t('control10') }}</div>
              <div class="layout__keys">{{ $t('control12') }}</div>
            </div>
            <div class="layout__copy">
              {{ $t('link') }}:
              <a href="https://t.me/ruinsworld" target="__blank"
                >t.me/ruinsworld</a
              >
            </div>
            <div class="layout__copy">{{ $t('copyright') }}</div>
          </div>
        </transition>
      </template>
    </Preloader>
  </div>

  <Gate v-else-if="!isDesktop" face="gadgets" />
  <Gate v-else face="chrome" />
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, Ref, watch } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';

// Emmiter
import emitter from '@/utils/emitter';

// Constants
import { ScreenHelper } from '@/utils/constants';
import { Races, Things } from '@/utils/constants';

// Types
import { EmitterEvents } from '@/models/api';

// Components
import Connect from '@/components/Connect.vue';
import Preloader from '@/components/Layout/Preloader.vue';
import Gate from '@/components/Layout/Gate.vue';
import Scene from '@/components/Scene/Scene.vue';
import LangSwitch from '@/components/Layout/LangSwitch.vue';
import Scale from '@/components/Layout/Scale.vue';
import Map from '@/components/Layout/Map.vue';
import Help from '@/components/Layout/Help.vue';
import Chat from '@/components/Layout/Chat.vue';

// Utils
import { restartDispatchHelper } from '@/utils/utils';

export default defineComponent({
  name: 'Layout',

  components: {
    Connect,
    Preloader,
    Scene,
    LangSwitch,
    Gate,
    Scale,
    Map,
    Help,
    Chat,
  },

  setup() {
    const { t } = useI18n();
    const store = useStore(key);

    let isDesktop: Ref<boolean> = ref(false);
    let nickname: Ref<string> = ref('');
    let keyHealth: Ref<number> = ref(0);
    let isFirts: Ref<boolean> = ref(false);
    const isBro = ScreenHelper.isBro();
    let onWindowResize: () => void;
    let play: () => void;
    let enter: () => void;
    let reenter: () => void;
    let beep: (is?: boolean) => void;
    let filter: (value: any) => void;
    let setRace: (value: string) => void;
    const isGameLoaded = computed(
      () => store.getters['preloader/isGameLoaded'],
    );
    const isEnter = computed(() => store.getters['persist/isEnter']);
    const isReload = computed(() => store.getters['not/isReload']);
    const locationData = computed(() => store.getters['api/locationData']);
    const isOnHit = computed(() => store.getters['api/isOnHit']);
    const health = computed(() => store.getters['api/health']);
    const name = computed(() => store.getters['persist/name']);
    const isGameOver = computed(() => store.getters['persist/isGameOver']);
    const isPause = computed(() => store.getters['persist/isPause']);
    const endurance = computed(() => store.getters['persist/endurance']);
    const isTired = computed(() => store.getters['persist/isTired']);
    const isOptical = computed(() => store.getters['not/isOptical']);
    const isMap = computed(() => store.getters['not/isMap']);
    const isHelp = computed(() => store.getters['not/isHelp']);
    const isChat = computed(() => store.getters['not/isChat']);
    const messages = computed(() => store.getters['not/messages']);
    const message = computed(() => store.getters['not/message']);
    const content = computed(() => store.getters['not/content']);
    const language = computed(() => store.getters['persist/language']);
    const race = computed(() => store.getters['persist/race']);
    const last = computed(() => store.getters['persist/last']);
    const isPick = computed(() => store.getters['not/isPick']);
    const exp = computed(() => Math.round(store.getters['api/exp']));
    const food = computed(() => Math.round(store.getters['persist/food']));
    const water = computed(() => Math.round(store.getters['persist/water']));
    const toxic = computed(() => Math.round(store.getters['persist/toxic']));
    const level = computed(() =>
      Math.floor(
        store.getters['api/exp'] / store.getters['persist/config']?.exp,
      ),
    );
    const grenades = computed(() => store.getters['persist/grenades']);
    const vodka = computed(() => store.getters['persist/vodka']);
    const stew = computed(() => store.getters['persist/stew']);
    const config = computed(() => store.getters['persist/config']);
    const isMove = computed(() => store.getters['not/isMove']);
    const isNotJump = computed(() => store.getters['not/isNotJump']);
    const shotTime = computed(() => store.getters['not/shotTime']);

    onMounted(() => {
      onWindowResize();
      window.addEventListener('resize', onWindowResize, false);

      nickname.value = name.value;

      setTimeout(() => {
        isFirts.value = true;
      }, 300);
    });

    onWindowResize = () => {
      isDesktop.value = ScreenHelper.isDesktop();
    };

    reenter = () => {
      beep();
      store
        .dispatch('persist/setPersistState', {
          field: 'last',
          value: locationData.value.id,
        })
        .then(() => {
          emitter.emit(EmitterEvents.reenter);
          restartDispatchHelper(store);
        });
    };

    enter = () => {
      beep();
      emitter.emit(EmitterEvents.enter, {
        name: nickname.value,
        race: race.value,
        location: last.value,
      });
      store.dispatch('persist/setPersistState', {
        field: 'name',
        value: nickname.value,
      });
    };

    play = () => {
      store.dispatch('persist/setPersistState', {
        field: 'isPause',
        value: !isPause.value,
      });
    };

    setRace = (value) => {
      store.dispatch('persist/setPersistState', {
        field: 'race',
        value,
      });
      beep();
    };

    filter = (value) => {
      if (value.data && !value.data.match(/[^0-9a-z\s]/gi)) beep();
      else beep(true);
      nickname.value = nickname.value.replace(/[^0-9a-z\s]/gi, '');
    };

    beep = (is = false) => {
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = new GainNode(ctx, {
        gain: 0.1,
      });
      if (!is) oscillator.frequency.value = Math.random() * 2200 + 440;
      else oscillator.frequency.value = 330;
      oscillator.connect(gainNode).connect(ctx.destination);
      oscillator.start();
      oscillator.stop(is ? 0.3 : 0.15);
    };

    // Следим за языком
    watch(
      () => language.value,
      (value) => {
        if (isFirts.value) beep();
      },
    );

    // Следим за картой
    watch(
      () => isMap.value,
      (value) => {
        if (isFirts.value) beep();
      },
    );

    // Следим за паузой
    watch(
      () => isPause.value,
      (value) => {
        if (isFirts.value) beep();
      },
    );

    // Следим за чатом
    watch(
      () => isChat.value,
      (value) => {
        if (isFirts.value) beep();
      },
    );

    // Следим за подсказкой
    watch(
      () => isHelp.value,
      (value) => {
        if (isFirts.value) beep();
      },
    );

    // Следим за здоровьем
    watch(
      () => health.value,
      (value) => {
        ++keyHealth.value;
      },
    );

    return {
      t,
      isDesktop,
      isBro,
      isGameLoaded,
      isEnter,
      isReload,
      isGameOver,
      isPause,
      isOptical,
      isTired,
      health,
      name,
      endurance,
      messages,
      message,
      content,
      play,
      enter,
      reenter,
      setRace,
      nickname,
      race,
      isOnHit,
      locationData,
      isMap,
      isHelp,
      isChat,
      language,
      keyHealth,
      isPick,
      exp,
      level,
      grenades,
      Races,
      Things,
      filter,
      vodka,
      config,
      food,
      water,
      toxic,
      stew,
      isMove,
      isNotJump,
      shotTime,
    };
  },
});
</script>

<style lang="stylus" scoped>
$name = '.layout'

$active
  padding 0
  pointer-events none
  opacity 1
  border 5px solid $colors.sea

$noactive
  padding 5px
  opacity 0.5
  border none

  &:hover
    padding 0
    cursor pointer
    border 5px solid $colors.sea

{$name}
  @extend $viewport
  text-align center

  &__race
    width 40vh
    height 25vh
    display flex
    margin 0 auto

    &--human
      > div:first-child
        @extend $active

      > div:last-child
        @extend $noactive

    &--reptiloid
      > div:first-child
        @extend $noactive

      > div:last-child
        @extend $active

    > div
      width calc(100% - 2.5vh)

      > div
        width 100%
        height 100%

    > div:first-child
      margin-right 5vh

    > div:first-child > div
      background url("../../assets/human.jpg") no-repeat center top
      background-size cover

    > div:last-child > div
      background url("../../assets/reptil.jpg") no-repeat center top
      background-size cover

  &--dead
    {$name}__header,
    {$name}__copy
      color $colors.stone

  &__header
    color $colors.sea
    margin-top 15vh
    $text("olga")

    &--noenter
      margin-top 5vh

  &__version
    color $colors.sea
    margin-bottom 2vh
    $text("nina")

  &__enter
    @extend $viewport
    background url("../../assets/enter.jpg") no-repeat center top
    background-size cover

    {$name}__effect
      z-index 20
      box-shadow inset 0 0 $gutter * 20 $colors.sea

  &__dialog
    @extend $viewport
    z-index 100

  &__title
    color $colors.sea
    margin-top 2vh
    margin-bottom 2vh
    $text("elena")

  &__nick
    color $colors.sea
    margin-bottom 2vh
    $text("natasha")

  &__input
    width 23vw
    padding-left 10 * $pixel
    padding-right 10 * $pixel
    margin-bottom 1vh
    color $colors.sea
    border 3 * $pixel solid $colors.sea
    background transparent
    $text("elena")

  &__overlay
    @extend $viewport
    z-index 10

    &--enter
      background linear-gradient(0deg, rgba($colors.primary, $opacites.rock) 0%, rgba($colors.ghost, $opacites.rock) 100%)

    &--dark
      background $colors.sea

    &--hit
      background $colors.hit

    &--light
      background lighten($colors.primary, 33%)

  &__effect
    @extend $viewport
    background rgba(112, 66, 20, 0.1)
    box-shadow inset 0 0 $gutter * 6 $colors.sea

  &__optical
    @extend $viewport
    display flex
    background-color rgba(255, 255, 255, 0.15)
    transform scale(1.1, 1.1)

    &--side
      background $colors.cosmos
      flex-grow 1
      transform scale(1.1, 1.1)

    &--center
      flex-grow 0
      background url("../../assets/optical.png") no-repeat center top
      background-size cover
      width 100vh
      height 100vh

    &-preload
      position absolute
      left 99999px
      opacity 0
      background url("../../assets/optical.png") no-repeat center top

  &__map,
  &__help,
  &__chat
    @extend $viewport
    z-index 10000

  &__chat
    position fixed
    overflow hidden
    top 30%
    left 0
    right 0
    bottom 0
    width 100vw
    height 70vh

  &__messages
    @extend $viewport
    text-align left
    list-style none
    padding 10 * $pixel 40vw 0 10px
    pointer-events none
    color $colors.stone

  &__message
    margin-bottom 0.5vw
    $text("maria")

  &__location,
  &__name
    position absolute
    right 10px
    color $colors.stone

  &__location
    top 10 * $pixel
    $text("nina")

  &__name
    text-align right
    max-width 37vw
    top 30 * $pixel
    $text("maria")

  &__blocker
    @extend $viewport
    text-align center
    z-index 2000

    &--pause
      background linear-gradient(0deg, rgba($colors.primary, $opacites.funky) 0%, rgba($colors.ghost, $opacites.psy) 100%)

  &__buttons
    display flex
    align-items center
    flex-direction column
    justify-content center

  &__button
    @extend $button
    margin-top $gutter

    &--disabled
      pointer-events none
      opacity 0.5

    &--enter
      margin-bottom 5vh

    &--dead
      @extend $button--variant

  &__keys-wrapper
    margin-bottom $gutter * 2

  &__keys,
  &__copy
    margin-bottom 1vh
    color $colors.sea
    $text("nina")

  &__link
    margin-top 3vh
    margin-bottom 1vh
    color $colors.sea
    $text("natasha")

  &__copy
    margin-top $gutter
    $text("natasha")

  &__scales
    border 2 * $pixel solid $colors.stone

  &__scales
    position absolute
    bottom 1vh
    left 0.5vh
    width 15vw

    &-item
      display flex
      position absolute
      bottom 0
      width 12vh
      height 6vh

      &--vodka
        left 16vw

      &--stew
        left 23.5vw

      &-icon
        position relative
        margin-right 1vh
        min-width 4vh
        width 4vh
        height 6vh

        > svg,
        > div
          position absolute
          width 100%
          height 100%
          left 0
          right 0
          top 0
          bottom 0

        > div
          color $colors.sea
          transform translateY(2.5vh)
          $text("maria")

      &-number
        transform translateY(2.5vh)
        color #fff
        $text("elena")

      &-max
        transform translateY(2.7vh)
        color #fff
        $text("nina")
        $opacity("psy")

  &__ammo
    position absolute
    bottom 3vh
    right 0.5vh
    color $colors.stone
    $text("olga")

    > span
      $opacity("funky")
      $text("nina")

  &__ammo-scale
    border 2 * $pixel solid $colors.stone
    position absolute
    bottom -2.5vh
    right 0.5vh
    width 11vw

    &--disabled
      opacity 0.5
</style>
