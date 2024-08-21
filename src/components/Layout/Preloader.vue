<template>
  <div class="preloader">
    <slot />
    <div v-if="isReload" class="preloader__gate" />
    <div v-else-if="isEnter && !isGameLoaded" class="preloader__gate">
      <Loader />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';

// Components
import Loader from '@/components/Layout/Loader.vue';

export default defineComponent({
  name: 'Preloader',

  components: {
    Loader,
  },

  setup() {
    const store = useStore(key);

    const isEnter = computed(() => store.getters['persist/isEnter']);
    const isGameLoaded = computed(
      () => store.getters['preloader/isGameLoaded'],
    );

    const isReload = computed(() => store.getters['not/isReload']);

    return {
      isEnter,
      isGameLoaded,
      isReload,
    };
  },
});
</script>

<style lang="stylus" scoped>
.preloader
  &__gate
    @extend $viewport
    @extend $flexCenter
    color $colors.white
    background $colors.black
    z-index 2000
    $text('olga')
</style>
