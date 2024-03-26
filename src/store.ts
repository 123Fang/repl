import { StoreOptions, File, ReplStore, compileFile } from '@vue/repl';
import { ref, computed } from 'vue';

// 组件库样式
const style = ref('https://cdn.jsdelivr.net/npm/fx-ui-vue@0.6.4/style.css');

const appFileCode = `
<<template>
<fx-input v-model="value1" placeholder="基本使用"></fx-input>
</template>

<!-- js -->
<script setup lang="ts">
import {ref} from 'vue'
const value1 = ref('')
</script>
`.trim();

const CONTAINER_FILE = 'src/Container.vue';
const APP_FILE = 'src/App.vue';
const INSTALL_FILE = 'src/install-nutui.js';
const IMPORTMAP_FILE = 'import-map.json';
const TSCONFIG_FILE = 'tsconfig.json';

const containerCode = `\
<script setup>
import App from './App.vue'
import {installNutUI} from './install-nutui.js'

installNutUI()
</script>

<template>
  <App />
</template>
`;
const installCode = computed(
  () => `import FXUI from 'fx-ui-vue'
import { getCurrentInstance } from 'vue'

const appendStyle = () => {
  return new Promise((resolve, reject) => {
    const style = document.createElement('style')
    style.innerHTML = '* { margin: 0; padding: 0; }'
    document.body.appendChild(style)

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '${style.value}'
    link.onload = resolve
    link.onerror = reject
    document.body.appendChild(link)
  })
}
await appendStyle()

export const installNutUI = () => {
  const { parent } = window
  const instance = getCurrentInstance()
  instance.appContext.app.use(FXUI)
}
`
);

const utoa = (data: string) => {
  return btoa(unescape(encodeURIComponent(data)));
};

const atou = (b64: string) => {
  return decodeURIComponent(escape(atob(b64)));
};

// 不允许修改的文件，不通过 URL 传递
const filterFiles = [IMPORTMAP_FILE, CONTAINER_FILE, INSTALL_FILE];


/**
 * @vue/repl的生命周期抽象成了一个class ReplStore，
 * ReplStore 只预置了Vue的运行环境，假设我想预置更多的模块，比如支持lodash，组件库等等。
 * 所以这里需要改造一下，继承ReplStore做一些改造。
 * **/
export class FXUIStore extends ReplStore {
  constructor(storeOptions?: StoreOptions, hash?: string) {
    super(storeOptions);
    if (hash) {
      const saved = JSON.parse(atou(hash));
      for (const filename in saved) {
        const newName = filename.startsWith('src/') ? filename : `src/${filename}`;
        if (!filterFiles.includes(newName)) {
          this.addFile(new File(newName, saved[filename]));
        }
      }
    } else {
      const main = new File(APP_FILE, appFileCode, false);
      this.addFile(main);
    }

    const container = new File(CONTAINER_FILE, containerCode, false); // 入口组件，隐藏
    this.addFile(container);

    const install = new File(INSTALL_FILE, installCode.value, false); // install UI组件，隐藏
    this.addFile(install);

    this.state.mainFile = CONTAINER_FILE; // 设置入口组件名
    this.setActive(APP_FILE); // 设置当前tab组件
  }
  serialize() {
    // 为了更简洁，这里隐藏了如下四个文件 
    // 1 IMPORTMAP_FILE  2 TSCONFIG_FILE  3 CONTAINER_FILE  4 INSTALL_FILE
    const files = this.getFiles();
    delete files[IMPORTMAP_FILE];
    delete files[TSCONFIG_FILE];
    delete files[CONTAINER_FILE.replace('src/', '')];
    delete files[INSTALL_FILE.replace('src/', '')];
    return '#' + utoa(JSON.stringify(files));
  }

  // 切换组件库版本
  setFXUIVersion(v: string) {
    style.value = `https://cdn.jsdelivr.net/npm/fx-ui-vue@0${v}/style.css`
    const install = new File(INSTALL_FILE, installCode.value, true);
    this.addFile(install);
    compileFile(this, install).then((errs) => this.state.errors.push(...errs));
    this.setImportMap({
      imports: {
        'fx-ui-vue': `https://cdn.jsdelivr.net/npm/fx-ui-vue@${v}/dist/fx-ui-vue.js`,
        // 'dist/packages/toast/style': './style.js',
        // 'dist/packages/dialog/style': './style.js',
        // 'dist/packages/imagepreview/style': './style.js',
        // 'dist/packages/notify/style': './style.js'
      }
    });
  }
}
