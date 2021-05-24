<template>
    <div
      v-for="(value, key) in finalProps"
      :key="key"
      class="props-form-wrapper"
    >
      <span v-if="value.label" class="label">{{value.label}}</span>
      <component
        :is='value.component'
        v-bind="value.extraProps"
        :[`${value.valueProp}`]='value.value'
        v-on='value.events'
        class="props-form-input"
      >
        <template v-if="value.options && Object.keys(value.options).length">
          <component
            v-for="(options, key) in value.options"
            :key="key"
            :is='value.subComponent'
            :value='options.value'
          >
            <render-v-node :vnode="options.key" />
          </component>
        </template>
      </component>
      </div>
</template>
<script lang='ts'>
import { computed, defineComponent, PropType, VNode } from 'vue';
import { reduce } from 'lodash-es';
import { TextComponentProps } from '@/defaultProps';
import { mapPropsToForms } from '@/propsMap';
import RenderVNode from '@/components/RenderVNode.vue';

// 表单props接口
interface FormProps {
  value: string;
  valueProp: string;
  eventName: string;
  events: {
    [k: string]: (e: any) => void;
  },
  component: string;
  subComponent?: string;
  extraProps?: {
    [key: string]: any;
  };
  label?: string;
  // 组件是复合型组件时
  options?: { key: string | VNode, value: string }[];
}

export default defineComponent({
  components: { RenderVNode }, 
  name: 'PropsForm',
  component: {
    RenderVNode
  },
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, context) {
    console.log(props);
    const finalProps = computed(() => reduce(props.props, (result, value, key) => {
      const newKey = key as keyof TextComponentProps;  
      const item = mapPropsToForms[newKey];
      if (item) {
        const { valueProp = 'value', eventName = 'change' , initialTransform, afterTransform } = item;
        const newItem: FormProps = {
          ...item,
          value: initialTransform ? initialTransform(value): value,
          valueProp,
          eventName,
          events: {
            [eventName]: (value) => {
              context.emit('change', { key, value: afterTransform ? afterTransform(value): value})
            }
          }
        }
        result[newKey] = newItem;
      }
      return result;
    }, {} as { [k: string]: FormProps }));
    return {
      finalProps,
    };
  },
});
</script>
<style scoped lang='scss'>
.props-form-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
  .label {
    width: 50px;
  }
  .props-form-input {
    flex: 1;
  }
}
</style>
