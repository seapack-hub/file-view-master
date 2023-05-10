import Vue from 'vue'
import App from './App.vue'
import VueViewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import ElementUI from 'element-ui'; // 2.1引入结构
import 'element-ui/lib/theme-chalk/index.css'; // 2.2引入样式

Vue.config.productionTip = false

Vue.use(VueViewer)
Vue.use(ElementUI); // 3.安装

new Vue({
  render: h => h(App),
}).$mount('#app')
