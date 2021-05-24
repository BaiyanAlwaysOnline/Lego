import { VNode } from 'vue'
import { TextComponentProps } from './defaultProps';


// 组件和form属性映射关系接口 
export interface PropToForm {
    component: string;
    subComponent?: string;
    extraProps?: {
      [key: string]: any;
    };
    label?: string;
    // 组件是复合型组件时
    options?: { key: string | VNode, value: string }[];
    // 拓展组件value属性，可配置，默认是'value'
    valueProp?: string;
    eventName?: string;
    initialTransform?: (k: any) => any;
    afterTransform?: (k: any) => any;
}

export type PropsToForms = {
  [P in keyof TextComponentProps]?: PropToForm
}

const fontFamilyArr = [
  { key: '宋体', value: '"SimSun","STSong"' },
  { key: '黑体', value: '"SimHei","STHeiti"' },
  { key: '楷体', value: '"KaiTi","STKaiti"' },
  { key: '仿宋', value: '"FangSong","STFangsong"' },
]

const fontFamilyArrShow = fontFamilyArr.map(font => {
  return {
    value: font.value,
    key: <span style={{ fontFamily: font.value }}>{ font.key }</span> as VNode
  }
})

export const mapPropsToForms: PropsToForms = {
  text: {
    component: 'a-textarea',
    label: '标题',
    extraProps: {
      autoSize: {
        minRows: 3
      }
    },
    afterTransform: (e: any) => e.target.value 
  },
  lineHeight: {
    component: 'a-slider',
    extraProps: {
      max: 3,
      min: 0,
      step: 0.1,
    },
    label: '行高',
    initialTransform: (k) => parseFloat(k),
    afterTransform: (e: any) => e.toString()
  },
  fontSize: {
    component: 'a-input-number',
    label: '字号',
    initialTransform: (k) => parseInt(k),
    afterTransform: (e: any) => e && `${e}px`
  },
  textAlign: {
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    label: '对齐',
    options: [
      { value: 'left', key: '左' },
      { value: 'center', key: '中' },
      { value: 'right', key: '右' }
    ],
    afterTransform: (e: any) => e && e.target.value
  },
  fontFamily: {
    component: 'a-select',
    subComponent: 'a-select-option',
    label: '字体',
    options: [
      { value: '', key: '无' },
      ...fontFamilyArrShow,
    ]
  }
};
