/* eslint-disable import/no-cycle */
import { createStore } from 'vuex';
import templates, { TemplatesProps } from '@/store/template';
import user, { UserProps } from '@/store/user';

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplatesProps;
}

export default createStore<GlobalDataProps>({
  modules: {
    templates,
    user,
  },
});
