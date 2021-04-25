import { computed, defineComponent, PropType, VNode } from 'vue';
import { Input, InputNumber, Slider, Radio, Select  } from 'ant-design-vue'
import { reduce } from 'lodash-es';
import { TextComponentProps } from '@/defaultProps';
import { mapPropsToForms } from '@/propsMap.tsx';
const mapToComponent = {
  'a-textarea': Input.TextArea,
  'a-input-number': InputNumber,
  'a-slider': Slider,
  'a-radio-group': Radio.Group,
  'a-radio-button': Radio.Button,
  'a-select': Select,
  'a-select-option': Select.Option
} as any

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

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

export default defineComponent({
    name: 'PropsForm',
    props: {
      props: {
        type: Object as PropType<TextComponentProps>,
        required: true,
      },
    },
    emits: ['change'],
    setup(props, context) {
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
              [`on${capitalizeFirstLetter(eventName)}`]: (value) => {
                context.emit('change', { key, value: afterTransform ? afterTransform(value): value})
              }
            }
          }
          result[newKey] = newItem;
        }
        return result;
      }, {} as { [k: string]: FormProps }));

      return () => 
        (
            <div class="props-form">
                {Object.keys(finalProps.value).map(key => {
                    const value = finalProps.value[key];
                    const Component = mapToComponent[value.component];
                    const SubComponent = value.subComponent && mapToComponent[value.subComponent];
                    const options = value.options;
                    const props = {
                        [value.valueProp]: value.value,
                        ...value.extraProps,
                        ...value.events
                    }
                    return (
                        <div
                            class="props-form-wrapper"
                            key={key}
                        >
                            { value && <span class="label">{value.label}</span> }
                            <Component {...props} class="props-form-input">
                                {
                                    options && options.map(option => {
                                        return (
                                            <SubComponent key={option.key} value={option.value}>
                                                {option.key}
                                            </SubComponent>
                                        )
                                    })
                                }
                            </Component>
                        </div>
                    )
                })}
            </div>
        )
    },
  })