<template>
  <div class="map">
    <div class="map__wrapper">
      <Loader v-if="!map" />

      <div v-else class="map__wrapper-inner">
        <div class="map__world">
          <div class="map__alpha">
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 0">A</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 1">B</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 2">C</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 3">D</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 4">E</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 5">F</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 6">G</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 7">H</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 8">I</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 9">J</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 10">K</div>
          </div>
          <div class="map__numbers">
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 0">1</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 1">2</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 2">3</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 3">4</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 4">5</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 5">6</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 6">7</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 7">8</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 8">9</div>
            <div v-if="Math.floor(Math.sqrt(map.locations.length)) > 10">
              11
            </div>
          </div>
          <div
            v-for="item in map.locations"
            :key="`item--${item.id}`"
            class="map__location"
            :class="{
              'map__location--this': item.id === location,
              'map__location--town':
                Math.abs(item.x) < 2 && Math.abs(item.y) < 2,
            }"
            :style="`width: 4.2vh; height: 4.2vh; left: calc(${
              item.x + Math.floor(Math.sqrt(map.locations.length) / 2)
            } * 4.2vh); top: calc(${
              item.y + Math.floor(Math.sqrt(map.locations.length) / 2)
            } * 4.2vh);`"
          >
            <div
              class="map__location-inner"
              :class="{
                'map__location-inner--red': item.status === Races.human,
                'map__location-inner--blue': item.status === Races.reptiloid,
              }"
            />
          </div>
        </div>

        <div>
          <div class="map__scene">
            <div class="map__scene-center" />
            <div
              v-for="unit in map.units"
              :key="`unit--${unit.id}`"
              :class="{
                'map__point--dead': unit.isDead,
                'map__point--me': id === unit.id,
                'map__point--human':
                  unit.race === Races.human && id !== unit.id,
                'map__point--reptiloid':
                  unit.race === Races.reptiloid && id !== unit.id,
                'map__point--enemy':
                  unit.race !== Races.human &&
                  unit.race !== Races.reptiloid &&
                  ((unit.race !== Races.cyborg && race === Races.human) ||
                    (unit.race !== Races.soldier && race === Races.reptiloid)),
                'map__point--friend-human':
                  unit.race !== Races.human &&
                  unit.race !== Races.reptiloid &&
                  unit.race === Races.cyborg &&
                  race === Races.human,
                'map__point--friend-reptiloid':
                  unit.race !== Races.human &&
                  unit.race !== Races.reptiloid &&
                  unit.race === Races.soldier &&
                  race === Races.reptiloid,
              }"
              :style="`left: calc(${unit.x} * 30vh + 25vh); top: calc(${unit.y} * 30vh + 25vh);`"
            />
            <div
              v-for="zone in locationData.zones"
              :key="`zone--${zone.id}`"
              class="map__zone"
              :style="`left: calc(${zone.x / size} * 30vh + 25vh);
                top: calc(${zone.z / size} * 30vh + 25vh);
                transform: translateX(calc(-1 * ${
                  zone.radius / (size * 2)
                } * 30vh)) translateY(calc(-1 * ${
                zone.radius / (size * 2)
              } * 30vh));
                width: calc(${(zone.radius * 2) / size} * 30vh);
                height: calc(${(zone.radius * 2) / size} * 30vh);`"
            />
            <div
              v-for="build in locationData.builds"
              :key="`build--${build.id}`"
              class="map__build"
              :style="`left: calc(${build.x / size} * 30vh + 25vh);
                top: calc(${build.z / size} * 30vh + 25vh);
                width: calc(${build.scale / size} * 30vh);
                height: calc(${build.scale / size} * 30vh);
                transform: rotate(${build.rotateY}deg)`"
            />
            <div
              v-for="stone in locationData.stones3"
              :key="`zone--${stone.id}`"
              class="map__stone"
              :style="`left: calc(${stone.x / size} * 30vh + 25vh);
                top: calc(${stone.z / size} * 30vh + 25vh);
                width: calc(${stone.scaleX / size} * 30vh);
                height: calc(${stone.scaleZ / size} * 30vh);
                transform: rotate(${stone.rotateY}deg)`"
            />
            <div
              v-for="unit in locationData.wells"
              :key="`well--${unit.id}`"
              class="map__well"
              :style="`left: calc(${unit.x / size} * 30vh + 25vh);
                top: calc(${unit.z / size} * 30vh + 25vh);`"
            />
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
import { Races } from '@/utils/constants';

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
    const id = computed(() => store.getters['persist/id']);
    const location = computed(() => store.getters['api/location']);
    const locationData = computed(() => store.getters['api/locationData']);
    const hero = computed(() => store.getters['persist/id']);
    const race = computed(() => store.getters['persist/race']);
    const size = computed(() => store.getters['persist/config']?.size || null);

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
      race,
      Races,
      locationData,
      id,
      size,
    };
  },
});
</script>

<style lang="stylus" scoped>
$name = '.map'

$size = 1vh
$sizeLarge = 1.5vh
$sizeSuper = 2.5vh

$point($s)
  position absolute
  width $s
  height $s
  transform translateX($s / 2) translateY($sizeLarge / 2)
  border-radius 50%

{$name}
  background rgba(0, 0, 0, 0.5)

  &__alpha
    left -3vh
    top 1vh

    > div
      margin-bottom 1.9vh

  &__numbers
    display flex
    top -3vh
    left 1vh

    > div
      margin-right 2.4vh

  &__alpha,
  &__numbers
    position absolute
    color #fff
    $text("nina")
    $opacity("rock")

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

  &__location
    position absolute
    border 1px solid $colors.stone

  &__location--town
    background rgba($colors.stone, 0.25)

  &__location--this
    position absolute

    &::after
      position absolute
      left -0.5vh
      top -0.05vh
      content ""
      background $colors.stone
      $point($sizeSuper)

  &__location-inner
    position absolute
    width 100%
    height 100%
    left 0
    right 0
    top 0
    bottom 0

  &__location-inner--red
    background rgba($colors.bird, 0.5)

  &__location-inner--blue
    background rgba($colors.wood, 0.5)

  &__scene-center
    position absolute
    left 50%
    top 50%
    transform translateX(-2.75vh) translateY(-2.75vh)
    width 5vh
    height 5vh
    background rgba($colors.stone, 0.25)

  &__build,
  &__stone
    position absolute
    background rgba($colors.stone, 0.25)

  &__scene
    position relative
    width 50vh
    height 50vh
    overflow hidden
    border 2px solid $colors.stone

  &__well
    position absolute
    background $colors.bug
    $point($sizeLarge)

  &__zone
    position absolute
    background rgba($colors.dog, 0.33)
    border-radius 50%

  &__point--me
    background $colors.stone
    $point($sizeSuper)

  &__point--human
    background $colors.bird
    border 0.3vh solid $colors.stone
    $point($sizeLarge)

  &__point--reptiloid
    background $colors.wood
    border 0.3vh solid $colors.stone
    $point($sizeLarge)

  &__point--enemy
    background $colors.ghost
    $point($size)

  &__point--friend-human
    background $colors.bird
    $point($size)

  &__point--friend-reptiloid
    background $colors.wood
    $point($size)

  &__point--dead
    background $colors.stone
    $opacity("rock")
</style>
