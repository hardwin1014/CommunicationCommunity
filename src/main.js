import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'

// 时间配置
import './utils/dayutils'
// 全局css
import '@/style/index.less'
// rem适配
import 'amfe-flexible'
import 'github-markdown-css/github-markdown.css'

Vue.config.productionTip = false
// 引入vant
Vue.use(Vant)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
