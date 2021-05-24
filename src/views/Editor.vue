<template>
  <div class="editor-container">
    <a-layout>
      <a-layout-sider width="300" style="background: white">
        <div class="sidebar-container">
          组件列表
          <component-list :list="defaultTextTemplates" @addComponent="addItem" />
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px; background: gray">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <div class="preview-list" id="canvas-area">
            <editor-component
              v-for="component in components"
              :id="component.id"
              :key="component.id"
              :isActive="
                component.id === (curEditorComponent && curEditorComponent.id)
              "
              @onItemSelect="selectItem"
              @onItemDelete="deleteItem"
            >
              <component :is="component.name" v-bind="component.props" />
            </editor-component>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider
        width="300"
        style="background: white"
        class="settings-panel"
      >
        组件属性
        <props-form
          v-if="curEditorComponent && curEditorComponent.props"
          :props="curEditorComponent.props"
          @change="handleChange"
        />
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang='ts'>
import { GlobalDataProps } from '@/store';
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import LText from '@/components/LText.vue';
import LImage from '@/components/LImage.vue';
import ComponentList from '@/components/ComponentList.vue';
import EditorComponent from '@/components/EditorComponent.vue';
import PropsForm from '@/components/PropsForm.vue';
import defaultTextTemplates from '@/defaultTextTemplates';
import { TextComponentProps } from '@/defaultProps';
import { ComponentData } from '@/store/editor';

export default defineComponent({
  name: 'Editor',
  components: {
    ComponentList,
    EditorComponent,
    PropsForm,
    LText,
    LImage,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const components = computed<ComponentData[]>(
      () => store.state.editor.components
    );
    const curEditorComponent = computed<ComponentData | undefined>(
      () => store.getters.curEditorComponent
    );
    const addItem = (data: Partial<TextComponentProps>) => {
      store.commit('addComponent', data);
    };
    const selectItem = (id: string) => {
      store.commit('selectComponent', id);
    };
    const deleteItem = (id: string) => {
      store.commit('deleteComponent', id);
    };
    const handleChange = (e: any) => {
      store.commit('updateComponent', e);
    };

    return {
      components,
      defaultTextTemplates,
      addItem,
      selectItem,
      deleteItem,
      curEditorComponent,
      handleChange,
    };
  },
});
</script>

<style>
#canvas-area {
  width: 373px;
  overflow: hidden;
}
.editor-container .preview-container {
  padding: 24px;
  margin: 0;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.editor-container .preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
</style>
