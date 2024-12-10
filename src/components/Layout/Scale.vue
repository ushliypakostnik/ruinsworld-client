<template>
  <div class="scale" :class="[lock && 'scale--lock', not && 'effect-scale']">
    <div
      v-if="progress > 0"
      class="scale__progress"
      :class="`scale__progress--${face}`"
      :style="{ width: progress + '%' }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Scale',

  props: {
    face: {
      type: String,
      default: null,
      required: true,
    },
    progress: {
      type: Number,
      default: null,
      required: true,
    },
    lock: {
      type: Boolean,
      default: false,
      required: false,
    },
    not: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
});
</script>

<style lang="stylus" scoped>
.scale
  width 100%
  height 20px
  background transparent
  padding 5px

  &--lock
    opacity 0.5

  &__progress
    height 10px

    &--health
      background $colors.bird
      box-shadow 1px 2px 3px $colors.sea

    &--endurance
      background $colors.ghost
      box-shadow 1px 2px 3px $colors.sea

    &--food
      background $colors.dog
      box-shadow 1px 2px 3px $colors.sea

    &--water
      background $colors.bug
      box-shadow 1px 2px 3px $colors.sea
      
    &--toxic
      background $colors.cat
      box-shadow 1px 2px 3px $colors.sea

    &--weapon
      background $colors.stone
      box-shadow 1px 2px 3px $colors.sea
</style>
