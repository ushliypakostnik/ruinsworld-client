<template>
  <div class="help">
    <div class="help__wrapper">
      <div class="help__wrapper-inner">
        <div class="help__menu">
          <ul>
            <li>
              <a
                href="#"
                :class="{ 'help__menu--active': active === 1 }"
                @click="active = 1"
                >{{ $t('help1') }}</a
              >
            </li>
            <li>
              <a
                href="#"
                :class="{ 'help__menu--active': active === 2 }"
                @click="active = 2"
                >{{ $t('help2') }}</a
              >
            </li>
            <li>
              <a
                href="#"
                :class="{ 'help__menu--active': active === 3 }"
                @click="active = 3"
                >{{ $t('help3') }}</a
              >
            </li>
            <li>
              <a
                href="#"
                :class="{ 'help__menu--active': active === 4 }"
                @click="active = 4"
                >{{ $t('help4') }}</a
              >
            </li>
            <li>
              <a
                href="#"
                :class="{ 'help__menu--active': active === 5 }"
                @click="active = 5"
                >{{ $t('help5') }}</a
              >
            </li>
            <li>
              <a
                href="#"
                :class="{ 'help__menu--active': active === 6 }"
                @click="active = 6"
                >{{ $t('help6') }}</a
              >
            </li>
          </ul>
          <button
            class="help__button"
            type="button"
            @click.prevent.stop="close"
          >
            {{ $t('close') }}
          </button>
        </div>
        <div class="help__info">
          <div v-if="active === 1">
            <div class="help__info-wrapper">
              <div class="help__image--1" />
              <div class="help__item">{{ $t('history') }}</div>
              <div class="help__item">{{ $t('rule1') }}</div>
              <div class="help__item">{{ $t('rule2') }}</div>
              <div class="help__item">{{ $t('rule3') }}</div>
            </div>
          </div>
          <div v-if="active === 5">
            <div class="help__info-wrapper">
              <div class="help__item">{{ $t('feature1') }}</div>
              <div class="help__item">{{ $t('feature2') }}</div>
              <div class="help__item">{{ $t('feature3') }}</div>
            </div>
          </div>
          <div v-if="active === 6">
            <div class="help__info-wrapper">
              <div class="help__image--2" />
              <div class="help__item help__item--author">{{ $t('author') }}</div>
              <div class="help__item"><a href="https://levongambaryan.bandcamp.com/" target="_blank">levongambaryan.bandcamp.com</a></div>
              <div class="help__item"><a href="https://t.me/levongambaryan" target="_blank">t.me/levongambaryan</a></div>
              <div class="help__item"><a href="https://habr.com/ru/users/ushliypakostnik/" target="_blank">habr.com/ru/users/ushliypakostnik</a></div>
            </div>
          </div>
          <div v-if="active === 2">
            <div class="help__info-wrapper">
              <div class="help__item">{{ $t('control1') }}</div>
              <div class="help__item">{{ $t('control2') }}</div>
              <div class="help__item">{{ $t('control3') }}</div>
              <div class="help__item">{{ $t('control4') }}</div>
              <div class="help__item">{{ $t('control5') }}</div>
              <div class="help__item">{{ $t('control6') }}</div>
              <div class="help__item">{{ $t('control7') }}</div>
              <div class="help__item">{{ $t('control8') }}</div>
              <div class="help__item">{{ $t('control9') }}</div>
              <div class="help__item">{{ $t('control10') }}</div>
              <div class="help__item">{{ $t('control11') }}</div>
              <div class="help__item">{{ $t('control12') }}</div>

              <div class="help__item">
                <span class="help__text--red">{{ $t('scale11') }}</span>
                {{ $t('scale12') }}
              </div>
              <div class="help__item">
                <span class="help__text--purple">{{ $t('scale21') }}</span>
                {{ $t('scale22') }}
              </div>
              <div class="help__item">
                <span class="help__text--blue">{{ $t('scale31') }}</span>
                {{ $t('scale32') }}
              </div>
              <div class="help__item">
                <span class="help__text--green">{{ $t('scale41') }}</span>
                {{ $t('scale42') }}
              </div>
              <div class="help__item">
                <span class="help__text--yellow">{{ $t('scale51') }}</span>
                {{ $t('scale52') }}
              </div>

              <div class="help__item">{{ $t('scalemore') }}</div>
            </div>
          </div>
          <div v-if="active === 3">
            <div class="help__info-wrapper">
              <div class="help__title">{{ $t('nonplayersraces') }}</div>
              <div class="help__subtitle">{{ $t('nonplayersracestext') }}</div>

              <div class="help__race">
                <div class="help__race-image help__race-image--bidens" />
                <div>
                  <div class="help__race-name">{{ $t(`${Races.bidens}`) }}</div>
                  <div class="help__сharacteristic">
                    {{ $t(`enemy`) }}: {{ $t(`${Races.human}`) }},
                    {{ $t(`${Races.reptiloid}`) }}, {{ $t(`${Races.mutant}`) }},
                    {{ $t(`${Races.orc}`) }}, {{ $t(`${Races.soldier}`) }},
                    {{ $t(`${Races.cyborg}`) }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`important`) }}: {{ $t(`${Races.human}`) }},
                    {{ $t(`${Races.reptiloid}`) }}, {{ $t(`${Races.orc}`) }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`kick`) }}:
                    {{ config.races[`${Races.bidens}`].kick * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`attack`) }}:
                    {{ config.races[`${Races.bidens}`].attack * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`regeneration`) }}:
                    {{ config.races[`${Races.bidens}`].regeneration * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`intelligence`) }}:
                    {{ config.races[`${Races.bidens}`].intelligence * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`armor`) }}:
                    {{ config.races[`${Races.bidens}`].armor * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`exp`) }}: {{ config.races[`${Races.bidens}`].exp }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`toxic`) }}:
                    {{ config.races[`${Races.bidens}`].toxic }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`speed`) }}:
                    {{ config.races[`${Races.bidens}`].speed * 10 }}
                  </div>
                </div>
              </div>

              <div class="help__race">
                <div class="help__race-image help__race-image--zombie" />
                <div>
                  <div class="help__race-name">{{ $t(`${Races.zombie}`) }}</div>
                  <div class="help__сharacteristic">
                    {{ $t(`enemy`) }}: {{ $t(`${Races.human}`) }},
                    {{ $t(`${Races.reptiloid}`) }},
                    {{ $t(`${Races.soldier}`) }}, {{ $t(`${Races.cyborg}`) }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`important`) }}: {{ $t(`${Races.human}`) }},
                    {{ $t(`${Races.reptiloid}`) }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`kick`) }}:
                    {{ config.races[`${Races.zombie}`].kick * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`attack`) }}:
                    {{ config.races[`${Races.zombie}`].attack * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`regeneration`) }}:
                    {{ config.races[`${Races.zombie}`].regeneration * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`intelligence`) }}:
                    {{ config.races[`${Races.zombie}`].intelligence * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`armor`) }}:
                    {{ config.races[`${Races.zombie}`].armor * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`exp`) }}: {{ config.races[`${Races.zombie}`].exp }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`toxic`) }}:
                    {{ config.races[`${Races.zombie}`].toxic }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`speed`) }}:
                    {{ config.races[`${Races.zombie}`].speed * 10 }}
                  </div>
                </div>
              </div>

              <div class="help__race">
                <div class="help__race-image help__race-image--mutant" />
                <div>
                  <div class="help__race-name">{{ $t(`${Races.mutant}`) }}</div>
                  <div class="help__сharacteristic">
                    {{ $t(`enemy`) }}: {{ $t(`${Races.human}`) }},
                    {{ $t(`${Races.reptiloid}`) }}, {{ $t(`${Races.bidens}`) }},
                    {{ $t(`${Races.orc}`) }}, {{ $t(`${Races.soldier}`) }},
                    {{ $t(`${Races.cyborg}`) }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`important`) }}: {{ $t(`${Races.human}`) }},
                    {{ $t(`${Races.reptiloid}`) }}, {{ $t(`${Races.orc}`) }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`kick`) }}:
                    {{ config.races[`${Races.mutant}`].kick * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`attack`) }}:
                    {{ config.races[`${Races.mutant}`].attack * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`regeneration`) }}:
                    {{ config.races[`${Races.mutant}`].regeneration * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`intelligence`) }}:
                    {{ config.races[`${Races.mutant}`].intelligence * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`armor`) }}:
                    {{ config.races[`${Races.mutant}`].armor * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`exp`) }}: {{ config.races[`${Races.mutant}`].exp }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`toxic`) }}:
                    {{ config.races[`${Races.mutant}`].toxic }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`speed`) }}:
                    {{ config.races[`${Races.mutant}`].speed * 10 }}
                  </div>
                </div>
              </div>

              <div class="help__race">
                <div class="help__race-image help__race-image--orc" />
                <div>
                  <div class="help__race-name">{{ $t(`${Races.orc}`) }}</div>
                  <div class="help__сharacteristic">
                    {{ $t(`enemy`) }}: {{ $t(`${Races.human}`) }},
                    {{ $t(`${Races.reptiloid}`) }}, {{ $t(`${Races.bidens}`) }},
                    {{ $t(`${Races.mutant}`) }}, {{ $t(`${Races.soldier}`) }},
                    {{ $t(`${Races.cyborg}`) }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`important`) }}: {{ $t(`${Races.human}`) }},
                    {{ $t(`${Races.reptiloid}`) }}, {{ $t(`${Races.mutant}`) }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`kick`) }}:
                    {{ config.races[`${Races.orc}`].kick * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`attack`) }}:
                    {{ config.races[`${Races.orc}`].attack * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`regeneration`) }}:
                    {{ config.races[`${Races.orc}`].regeneration * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`intelligence`) }}:
                    {{ config.races[`${Races.orc}`].intelligence * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`armor`) }}:
                    {{ config.races[`${Races.orc}`].armor * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`exp`) }}: {{ config.races[`${Races.orc}`].exp }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`toxic`) }}: {{ config.races[`${Races.orc}`].toxic }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`speed`) }}:
                    {{ config.races[`${Races.orc}`].speed * 10 }}
                  </div>
                </div>
              </div>

              <div class="help__race">
                <div class="help__race-image help__race-image--cyborg" />
                <div>
                  <div class="help__race-name">{{ $t(`${Races.cyborg}`) }}</div>
                  <div class="help__сharacteristic">
                    {{ $t(`enemy`) }}: {{ $t(`${Races.reptiloid}`) }},
                    {{ $t(`${Races.bidens}`) }}, {{ $t(`${Races.mutant}`) }},
                    {{ $t(`${Races.orc}`) }}, {{ $t(`${Races.soldier}`) }},
                    {{ $t(`${Races.zombie}`) }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`important`) }}: {{ $t(`${Races.reptiloid}`) }},
                    {{ $t(`${Races.soldier}`) }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`kick`) }}:
                    {{ config.races[`${Races.cyborg}`].kick * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`attack`) }}:
                    {{ config.races[`${Races.cyborg}`].attack * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`regeneration`) }}:
                    {{ config.races[`${Races.cyborg}`].regeneration * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`intelligence`) }}:
                    {{ config.races[`${Races.cyborg}`].intelligence * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`armor`) }}:
                    {{ config.races[`${Races.cyborg}`].armor * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`exp`) }}: {{ config.races[`${Races.cyborg}`].exp }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`toxic`) }}:
                    {{ config.races[`${Races.cyborg}`].toxic }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`speed`) }}:
                    {{ config.races[`${Races.cyborg}`].speed * 10 }}
                  </div>
                </div>
              </div>

              <div class="help__race">
                <div class="help__race-image help__race-image--soldier" />
                <div>
                  <div class="help__race-name">
                    {{ $t(`${Races.soldier}`) }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`enemy`) }}: {{ $t(`${Races.human}`) }},
                    {{ $t(`${Races.bidens}`) }}, {{ $t(`${Races.mutant}`) }},
                    {{ $t(`${Races.orc}`) }}, {{ $t(`${Races.cyborg}`) }},
                    {{ $t(`${Races.zombie}`) }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`important`) }}: {{ $t(`${Races.human}`) }},
                    {{ $t(`${Races.cyborg}`) }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`kick`) }}:
                    {{ config.races[`${Races.soldier}`].kick * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`attack`) }}:
                    {{ config.races[`${Races.soldier}`].attack * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`regeneration`) }}:
                    {{ config.races[`${Races.soldier}`].regeneration * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`intelligence`) }}:
                    {{ config.races[`${Races.soldier}`].intelligence * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`armor`) }}:
                    {{ config.races[`${Races.soldier}`].armor * 10 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`exp`) }}: {{ config.races[`${Races.soldier}`].exp }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`toxic`) }}:
                    {{ config.races[`${Races.soldier}`].toxic }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`speed`) }}:
                    {{ config.races[`${Races.soldier}`].speed * 10 }}
                  </div>
                </div>
              </div>

              <div class="help__title">{{ $t('playersraces') }}</div>
              <div class="help__subtitle">{{ $t('playersracestext') }}</div>

              <div class="help__race">
                <div class="help__race-image help__race-image--human" />
                <div>
                  <div class="help__race-name">{{ $t(`${Races.human}`) }}</div>
                </div>
              </div>

              <div class="help__race">
                <div class="help__race-image help__race-image--reptiloid" />
                <div>
                  <div class="help__race-name">
                    {{ $t(`${Races.reptiloid}`) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="active === 4">
            <div class="help__info-wrapper">
              <div class="help__title">{{ $t('things') }}</div>
              <div class="help__subtitle">{{ $t('thingstext') }}</div>

              <div class="help__race">
                <div class="help__thing-image help__thing-image--grenades" />
                <div>
                  <div class="help__race-name">
                    {{ $t(`${Things.grenades}`) }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`exp`) }}:
                    {{ config.things[`${Things.grenades}`].exp }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`numbers`) }}:
                    {{ config.things[`${Things.grenades}`].pick }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`max`) }}:
                    {{ config.things[`${Things.grenades}`].max }}
                  </div>
                </div>
              </div>

              <div class="help__race">
                <div class="help__thing-image help__thing-image--vodka" />
                <div>
                  <div class="help__race-name">{{ $t(`${Things.vodka}`) }}</div>
                  <div class="help__сharacteristic">
                    {{ $t(`exp`) }}: {{ config.things[`${Things.vodka}`].exp }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`exp2`) }}:
                    {{ config.things[`${Things.vodka}`].exp2 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`health`) }}:
                    {{ config.things[`${Things.vodka}`].health }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`toxic2`) }}:
                    {{ config.things[`${Things.vodka}`].toxic }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`food`) }}:
                    {{ config.things[`${Things.vodka}`].food }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`water`) }}:
                    {{ config.things[`${Things.vodka}`].water }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`max`) }}: {{ config.things[`${Things.vodka}`].max }}
                  </div>
                </div>
              </div>

              <div class="help__race">
                <div class="help__thing-image help__thing-image--stew" />
                <div>
                  <div class="help__race-name">{{ $t(`${Things.stew}`) }}</div>
                  <div class="help__сharacteristic">
                    {{ $t(`exp`) }}: {{ config.things[`${Things.stew}`].exp }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`exp2`) }}:
                    {{ config.things[`${Things.stew}`].exp2 }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`health`) }}:
                    {{ config.things[`${Things.stew}`].health }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`toxic2`) }}:
                    {{ config.things[`${Things.stew}`].toxic }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`food`) }}:
                    {{ config.things[`${Things.stew}`].food }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`water`) }}:
                    {{ config.things[`${Things.stew}`].water }}
                  </div>
                  <div class="help__сharacteristic">
                    {{ $t(`max`) }}: {{ config.things[`${Things.stew}`].max }}
                  </div>
                </div>
              </div>

              <div class="help__title help__title--notext">{{ $t('thingsrare') }}</div>

              <div class="help__race">
                <div class="help__thing-image help__thing-image--go" />
                <div>
                  <div class="help__race-name">{{ $t(`${Things.go}`) }}</div>
                  <div class="help__сharacteristic">
                    {{ $t(`exp`) }}: {{ config.things[`${Things.go}`].exp }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { useI18n } from 'vue-i18n';

// Constants
import { Races, Things } from '@/utils/constants';

export default defineComponent({
  name: 'Help',

  setup() {
    const { t } = useI18n();
    const store = useStore(key);

    const active: Ref<number> = ref(1);
    const config = computed(() => store.getters['persist/config']);
    let close: () => void;

    close = () => {
      store.dispatch('not/setNotState', {
        field: 'isHelp',
        value: false,
      });
    };

    return {
      t,
      active,
      Races,
      Things,
      config,
      close,
    };
  },
});
</script>

<style lang="stylus" scoped>
$name = '.help'

{$name}
  background rgba(0, 0, 0, 0.75)

  &__text
    &--red
      color $colors.bird

    &--purple
      color $colors.ghost

    &--blue
      color $colors.bug

    &--green
      color $colors.dog

    &--yellow
      color $colors.cat

  &__wrapper
    width 100%
    height 100%
    @extend $flexCenter

  &__wrapper-inner
    width 125vh
    display flex
    justify-content space-between

  &__menu
    text-align left
    width 50vh
    height 30vh

    > ul
      list-style none
      padding 0

      > li
        text-align left
        color $colors.primary
        margin-bottom 20 * $pixel

        > a
          text-decoration none
          $opacity("funky")
          $text("maria")

          &:hover
            cursor pointer
            $opacity("waltz")

          &{$name}__menu--active
            pointer-events none
            text-decoration underline
            $opacity("waltz")

  &__info
    width 75vh
    height 75vh
    overflow-y auto
    border 2px solid $colors.primary
    text-align left
    color $colors.primary
    $text("nina")

    &-wrapper
      padding 20 * $pixel

  &__item
    margin-bottom 20 * $pixel

    &--author
      margin-bottom 40 * $pixel
      $text("maria")

  &__image--1
    width 100%
    height 30vh
    background url("../../assets/fable.jpg") no-repeat center center
    background-size cover
    margin-bottom 20 * $pixel

  &__image--2
    width 100%
    height 30vh
    background url("../../assets/levon.jpg") no-repeat center center
    background-size cover
    margin-bottom 20 * $pixel

  &__thing
    &-image
      width 20vh
      min-width 20vh
      height 20vh
      margin-right 20 * $pixel

      &--grenades
        background url("../../assets/grenades.jpg") no-repeat center center
        background-size cover

      &--vodka
        background url("../../assets/vodka.jpg") no-repeat center center
        background-size cover

      &--stew
        background url("../../assets/stew.jpg") no-repeat center center
        background-size cover

      &--go
        background url("../../assets/go.jpg") no-repeat center center
        background-size cover

  &__race
    margin-bottom 20 * $pixel
    display flex

    &-image
      width 20vh
      min-width 20vh
      height 35vh
      margin-right 20 * $pixel

      &--human
        width 20vh
        height 23vh
        background url("../../assets/russian.jpg") no-repeat center center
        background-size cover

      &--reptiloid
        width 20vh
        height 23vh
        background url("../../assets/reptiloid.jpg") no-repeat center center
        background-size cover

      &--bidens
        background url("../../assets/bidens.jpg") no-repeat center center
        background-size cover

      &--zombie
        background url("../../assets/zombie.jpg") no-repeat center center
        background-size cover

      &--mutant
        background url("../../assets/mutant.jpg") no-repeat center center
        background-size cover

      &--orc
        background url("../../assets/orc.jpg") no-repeat center center
        background-size cover

      &--cyborg
        background url("../../assets/cyborg.jpg") no-repeat center center
        background-size cover

      &--soldier
        background url("../../assets/soldier.jpg") no-repeat center center
        background-size cover

  &__title
    color $colors.primary
    margin-bottom 10 * $pixel
    $text("maria")

    &--notext
      margin-bottom 20 * $pixel

  &__subtitle
    color $colors.primary
    margin-bottom 20 * $pixel
    $text("natasha")

  &__race-name
    color $colors.primary
    margin-bottom 10 * $pixel
    $text("nina")

  &__сharacteristic
    color $colors.primary
    margin-bottom 5 * $pixel
    $text("natasha")

  &__button
    @extend $button
    @extend $button--primary
    margin-top $gutter
</style>
