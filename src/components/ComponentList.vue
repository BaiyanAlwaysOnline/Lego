<template>
    <div class="component-list">
        <div
          class="component-wrapper"
          v-for="(item, index) in list"
          :key="index"
          @click="handleClickItem(item)"
        >
            <l-text v-bind="item" />
        </div>
    </div>
</template>
<script lang='ts'>
import { PropType } from 'vue';
import LText from './LText.vue';
import { TextComponentProps } from '../defaultProps';

export default {
  name: 'ComponentList',
  components: {
    LText,
  },
  props: {
    list: {
      type: Array as PropType<TextComponentProps[]>,
      required: true,
    },
  },
  emits: ['on-item-click'],
  setup(props, ctx) {
    const handleClickItem = (data: Partial<TextComponentProps>) => {
      ctx.emit('on-item-click', data);
    };

    return {
      handleClickItem,
    };
  },
};
</script>
<style>
.component-list {
    display: flex;
    flex-wrap: wrap;
}
</style>
