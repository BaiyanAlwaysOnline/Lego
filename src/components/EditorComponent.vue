<template>
    <div
      :class="{'is-active': isActive, 'editor-component-wrapper': 'editor-component-wrapper'}"
      @click="handlSelectedComponent(id)"
    >
        <slot></slot>
    </div>
    <div @click="handleDelComponent(id)">del</div>
</template>
<script lang="ts">

export default {
  name: 'EditorComponent',
  props: {
    id: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['on-item-select', 'on-item-delete'],
  setup(props, ctx) {
    const handlSelectedComponent = (id: string) => {
      ctx.emit('on-item-select', id);
    };
    const handleDelComponent = (id: string) => {
      ctx.emit('on-item-delete', id);
    };
    return {
      handlSelectedComponent,
      handleDelComponent,
    };
  },
};
</script>

<style scoped lang='scss'>
.editor-component-wrapper {
  &:hover {
    border: 1px solid lawngreen;
  }
  &.is-active {
    border: 1px solid red;
  }
}

</style>>
