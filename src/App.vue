<script setup lang="ts">
import { Repl } from '@vue/repl';
import CodeMirror from '@vue/repl/codemirror-editor';
import { watchEffect } from 'vue';
import { FXUIStore } from './store';
import Header from './Header.vue';


const setVH = () => {
  document.documentElement.style.setProperty('--vh', window.innerHeight + `px`);
};
window.addEventListener('resize', setVH);
setVH();

const hash = location.hash.slice(1);

const store = new FXUIStore(
  {
    defaultVueRuntimeURL: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.js'
  },
  hash
);

store.setImportMap({
  imports: {
    'fx-ui-vue': 'https://cdn.jsdelivr.net/npm/fx-ui-vue@0.6.4/dist/fx-ui-vue.js',
    "@drag-drop/core": "http://127.0.0.1:5500/dist2/assets/core.js",
    "@drag-drop/plugin-auxiliary-line": "http://127.0.0.1:5500/dist2/assets/plugin.js"
  }
});

// persist state
watchEffect(() => {
  const newHash = store.serialize();
  history.replaceState({}, '', newHash);
});
</script>

<template>
  <Header :store="store" />
  <Repl
    :editor="CodeMirror"
    :store="store"
    :show-import-map="false"
    :show-ts-config="false"
    @keydown.ctrl.s.prevent
    @keydown.meta.s.prevent
  />
</template>

<style>
.dark {
  color-scheme: dark;
}

body {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  margin: 0;
  --base: #444;
  --nav-height: 50px;
}

.vue-repl {
  --color-branding: #f53535 !important;
  --color-branding-dark: #f53535 !important;
  height: calc(var(--vh) - var(--nav-height)) !important;
}

button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}
</style>
