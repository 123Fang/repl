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



export const installNutUI = () => {
  const { parent } = window
  const instance = getCurrentInstance()
  instance.appContext.app.use(FXUI)
}
`
);



// 不允许修改的文件，不通过 URL 传递



export class FXUIStore extends ReplStore {
  constructor(storeOptions?: StoreOptions, hash?: string) {
    super(storeOptions);
    if (hash) {
      const saved = JSON.parse(atou(hash));
      for (const filename in saved) {
        
        }
      }
    } else {
      const main = new File(APP_FILE, appFileCode, false);
      this.addFile(main);
    }

    this.state.mainFile = CONTAINER_FILE; // 设置入口组件名
    this.setActive(APP_FILE); // 设置当前tab组件
  }
  serialize() {
    const files = this.getFiles();
    return '#' + utoa(JSON.stringify(files));
  }

  setFXUIVersion(v: string) {
    style.value = `https://cdn.jsdelivr.net/npm/fx-ui-vue@0${v}/style.css`
    const install = new File(INSTALL_FILE, installCode.value, true);
    this.addFile(install);
    compileFile(this, install).then((errs) => this.state.errors.push(...errs));
    this.setImportMap({
      imports: {
        'fx-ui-vue': `https://cdn.jsdelivr.net/npm/fx-ui-vue@${v}/dist/fx-ui-vue.js`,
   
      }
    });
  }
}
