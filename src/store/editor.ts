/**
 * @description editor module
 */
import { v4 as uuidv4 } from 'uuid';
import { Module } from 'vuex';
import { GlobalDataProps } from './index';

export interface ComponentData {
  // 组件id
  id: string;
  // 组件属性
  props: { [key: string]: unknown };
  // 组件名称 格式：l-image
  name: string;
}

export interface EditorProps {
  components: ComponentData[];
  curEditorComponentId: string;
}

const testData: ComponentData[] = [
  { id: uuidv4(), name: 'l-text', props: { text: 'hello1', fontSize: '16px', color: 'blue', lineHeight: '0.7', fontFamily: '', textAlign: 'left'} },
  { id: uuidv4(), name: 'l-text', props: { text: 'hello2', fontSize: '30px', color: 'red', lineHeight: '1', fontFamily: '', textAlign: 'center' } },
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      text: 'hello3', fontSize: '18px', tag: 'a', actionType: 'url', fontFamily: '', url: 'https://www.baidu.com',
    },
  },
  // 如果不加 fontFamily: ''    切换当前编辑的组件会报错
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      text: 'hello3', fontSize: '18px', color: 'green'
    },
  },
];

const editorModule: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testData,
    curEditorComponentId: '',
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      state.components.push(component);
    },
    selectComponent(state, id: string) {
      state.curEditorComponentId = id
    },
    deleteComponent(state, props: string) {
      state.components = state.components.filter((component) => component.id !== props);
    },
    updateComponent(state, { key, value }) {
      state.components.forEach((component) => {
        if (component.id === state.curEditorComponentId) {
          component.props = {
            ...component.props,
            [key]: value
          }
        }
      });
    }
  },
  getters: {
    curEditorComponent: ({ components, curEditorComponentId }): ComponentData | undefined => {
      return components.find((comp) => comp.id === curEditorComponentId);
    },
  },
};

export default editorModule;
