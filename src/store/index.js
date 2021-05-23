import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 调取本地储存
    user: getItem('cur_user')
  },
  mutations: {
    setUser (state, user) {
      // 对state数据进行修改
      state.user = user
      // 进行本地储存
      setItem('cur_user', user)
    }
  },
  actions: {
  },
  modules: {
  }
})
