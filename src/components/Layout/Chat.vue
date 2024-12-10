<template>
  <div class="chat">
    <div class="chat__wrapper">
      <input
        id="input"
        class="chat__input"
        v-model="text"
        maxlength="200"
        @input="input"
      />
      <div class="chat__text">{{ $t('chat') }}</div>
      <button
        class="chat__button chat__button--1"
        type="button"
        @click.prevent.stop="close"
      >
        {{ $t('close') }}
      </button>
      <button
        class="chat__button"
        :class="{ 'chat__button--disabled': !text.length }"
        type="button"
        @click.prevent.stop="send"
      >
        {{ $t('send') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';

// Emmiter
import emitter from '@/utils/emitter';

// Types
import { EmitterEvents } from '@/models/api';

export default defineComponent({
  name: 'Chat',

  setup() {
    const { t } = useI18n();
    const store = useStore(key);

    let text: Ref<string> = ref('');
    let isFirts: Ref<boolean> = ref(false);
    let beep: (is?: boolean) => void;
    let close: () => void;
    let send: () => void;
    let input: () => void;
    const isSendByEnter = computed(() =>
      Math.round(store.getters['not/isSendByEnter']),
    );

    onMounted(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.getElementById('input').focus();

      setTimeout(() => {
        isFirts.value = true;
      }, 300);
    });

    beep = () => {
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = new GainNode(ctx, {
        gain: 0.1,
      });
      oscillator.frequency.value = Math.random() * 2200 + 440;
      oscillator.connect(gainNode).connect(ctx.destination);
      oscillator.start();
      oscillator.stop(0.15);
    };

    close = () => {
      store.dispatch('not/setNotState', {
        field: 'isChat',
        value: false,
      });
    };

    send = () => {
      emitter.emit(EmitterEvents.send, text.value);
      text.value = '';
      store.dispatch('not/setNotState', {
        field: 'text',
        value: '',
      });
    };

    input = () => {
      store.dispatch('not/setNotState', {
        field: 'text',
        value: text.value,
      });
    };

    // Следим за вводом
    watch(
      () => text.value,
      (value) => {
        if (isFirts.value) beep();
      },
    );

    // Следим за отправкой по Enter
    watch(
      () => isSendByEnter.value,
      (value) => {
        if (value) {
          text.value = '';
          store.dispatch('not/setNotState', {
            field: 'isSendByEnter',
            value: false,
          });
        }
      },
    );

    return {
      t,
      text,
      close,
      send,
      input,
    };
  },
});
</script>

<style lang="stylus" scoped>
$name = '.chat'

{$name}
  position relative
  background linear-gradient(0deg, rgba($colors.sea, $opacites.waltz) 40%, rgba($colors.ghost, $opacites.reggae) 100%)

  &__wrapper
    position absolute
    left 0
    right 0
    bottom 0
    padding-bottom 40 * $pixel

  &__text
    margin-top 20 * $pixel
    color $colors.stone
    $text("maria")

  &__input
    width 60vw
    height 3vw
    padding-left 10 * $pixel
    padding-right 10 * $pixel
    margin-bottom 1vh
    color $colors.stone
    border 3 * $pixel solid $colors.stone
    background transparent
    $text("elena")

  &__button
    @extend $button
    @extend $button--variant
    margin-top $gutter

    &--disabled
      pointer-events none
      opacity 0.5

    &--1
      margin-right 20 * $pixel
</style>
