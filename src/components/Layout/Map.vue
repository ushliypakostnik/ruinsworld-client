<template>
  <div class="map">
    <div class="map__wrapper">
      <Loader v-if="!map" />

      <div v-else class="map__wrapper-inner">
        <div
          class="map__world"
        >
          <div
            v-for="item in map.locations"
            :key="`item--${item.id}`"
            class="map__location"
            :class="{
              'map__location--this': item.id === location,
              'map__location--town': Math.abs(item.x) < 2 && Math.abs(item.y) < 2,
              'map__location--center': item.x === 0 && item.y === 0
            }"
            :style="`width: 2.1vh; height: 2.1vh; left: calc(${item.x + Math.floor(Math.sqrt(map.locations.length) / 2)
              } * 2.1vh); top: calc(${item.y + Math.floor(Math.sqrt(map.locations.length) / 2)
              } * 2.1vh);`"
          >
          </div>
        </div>

        <div>
          <div class="map__scene">
            <div
              v-for="unit in map.units"
              :key="`npc--${unit.id}`"
              class="point"
              :class="{
                'map__point--dead': unit.isDead,
                'map__point--human': unit.race === 'human',
                'map__point--reptiloid': unit.race === 'reptiloid',
                'map__point--npc': unit.race !== 'human' && unit.race !== 'reptiloid',
              }"
              :style="`left: calc(${unit.x} * 46vh + 23vh); top: calc(${unit.y} * 46vh + 23vh);`"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';

// Components
import Loader from '@/components/Layout/Loader.vue';

export default defineComponent({
  name: 'Map',

  components: {
    Loader,
  },

  setup() {
    const { t } = useI18n();
    const store = useStore(key);

    let timeout: ReturnType<typeof setInterval>;

    const map = computed(() => store.getters['api/map']);
    const location = computed(() => store.getters['api/location']);
    const hero = computed(() => store.getters['persist/id']);

    onMounted(() => {
      store.dispatch('api/getMap', location.value);
      timeout = setInterval(() => {
        store.dispatch('api/getMap', location.value);
      }, 1000);
    });

    onBeforeUnmount(() => {
      store.dispatch('api/clearMap').then(() => {
        clearInterval(timeout);
      });
    });

    return {
      t,
      map,
      hero,
      location,
    };
  },
});
</script>

<style lang="stylus" scoped>
$name = '.map'

$size = 1vh
$sizeLarge = 1.5vh

$point($s)
  position absolute
  width $s
  height $s
  transform translateX($s / 2) translateY($sizeLarge / 2)
  border-radius 50%

{$name}
  background rgba(0, 0, 0, 0.5)

  &__wrapper
    width 100%
    height 100%
    @extend $flexCenter

  &__wrapper-inner
    width 80vh
    display flex
    justify-content space-between

  &__world
    position relative
    margin-right 10vh

  &__location
    position absolute
    border 1px solid $colors.stone

  &__location--town
    background: rgba($colors.stone, 0.25)

  &__location--center
    background rgba($colors.stone, 0.5)

  &__location--this
    background $colors.stone

  &__scene
    position relative
    width 50vh
    height 50vh
    overflow hidden
    border 2px solid $colors.stone

  &__point--human
    background $colors.bird
    $point($sizeLarge)

  &__point--reptiloid
    background $colors.wood
    $point($sizeLarge)

  &__point--npc
    background $colors.ghost
    $point($size)
  
  &__point--dead
    background $colors.stone
    $opacity("rock")

{$name}__user--hero
  background $colors.dog
</style>
