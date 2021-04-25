import { createStore } from 'vuex';
import templates, { TemplatesProps } from '@/store/template';
import user, { UserProps } from '@/store/user';
import editor, { EditorProps } from '@/store/editor';
export interface GlobalDataProps {
  user: UserProps;
  templates: TemplatesProps;
  editor: EditorProps;
}

export default createStore<GlobalDataProps>({
  modules: {
    templates,
    user,
    editor,
  },
});
