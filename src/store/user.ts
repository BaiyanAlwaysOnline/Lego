import { Module } from 'vuex';
import { GlobalDataProps } from './index';

export interface UserProps {
  isLogin: boolean,
  userName?: string,
}

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false,
  },
  mutations: {
    login(state) {
      Object.assign(state, { isLogin: true, userName: 'beyond' });
    },
    logout(state) {
      Object.assign(state, { isLogin: false });
    },
  },
};

export default user;
