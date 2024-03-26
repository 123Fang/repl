import { createApp } from 'vue';
import App from './App.vue';
import FXUI from 'fx-ui-vue'
import 'fx-ui-vue/style.css' // 引入样式
import './style.css';

// @ts-expect-error Custom window property
window.VUE_DEVTOOLS_CONFIG = {
  defaultSelectedAppId: 'repl'
};

createApp(App).use(FXUI).mount('#app');
