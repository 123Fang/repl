<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Sun from './icons/Sun.vue';
import Moon from './icons/Moon.vue';
import Share from './icons/Share.vue';
import GitHub from './icons/GitHub.vue';
import type { FXUIStore } from './store';

const props = defineProps<{
  store: FXUIStore;
}>();
const fxuiVersion = ref(`latest`);

async function setFXUIVersion(v: string) {
  fxuiVersion.value = `loading...`;
  props.store.setFXUIVersion(v);
  fxuiVersion.value = `v${v}`;
}

async function copyLink() {
  await navigator.clipboard.writeText(location.href);
  alert('您要分享的 url 已经被复制！');
}

function toggleDark() {
  const cls = document.documentElement.classList;
  cls.toggle('dark');
  localStorage.setItem('vue-sfc-playground-prefer-dark', String(cls.contains('dark')));
}
onMounted(toggleDark)
</script>

<template>
  <nav>
    <h1>
      <img
        alt="logo"
        src="http://120.78.136.2/fxui/assets/logo-d84f7269.jpeg"
      />
      <span>fx-ui  Playground</span>
    </h1>
    <div class="links">
      <!-- todo 1 版本选择 2 下载-->
      <button title="Toggle dark mode" class="toggle-dark" @click="toggleDark">
        <Sun class="light" />
        <Moon class="dark" />
      </button>
      <button title="Copy sharable URL" class="share" @click="copyLink">
        <Share />
      </button>
      <button title="View on GitHub" class="github">
        <a href="https://github.com/123Fang/fx-ui" target="_blank">
          <GitHub />
        </a>
      </button>
    </div>
  </nav>
</template>

<style>
nav {
  --bg: #fff;
  --bg-light: #fff;
  --border: #ddd;
  --btn: #666;
  --highlight: #333;
  --green: #3ca877;
  --purple: #904cbc;
  --btn-bg: #eee;

  color: var(--base);
  height: var(--nav-height);
  box-sizing: border-box;
  padding: 0 1em;
  background-color: var(--bg);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.33);
  position: relative;
  z-index: 999;
  display: flex;
  justify-content: space-between;
}

.dark nav {
  --base: #ddd;
  --bg: #1a1a1a;
  --bg-light: #242424;
  --border: #383838;
  --highlight: #fff;
  --btn-bg: #333;

  box-shadow: none;
  border-bottom: 1px solid var(--border);
}

h1 {
  font-weight: 500;
  display: inline-flex;
  place-items: center;
}

h1 img {
  height: 24px;
  margin-right: 10px;
}

@media (max-width: 560px) {
  h1 span {
    font-size: 0.9em;
  }
}

@media (max-width: 520px) {
  h1 span {
    display: none;
  }
}

.links {
  display: flex;
}

.toggle-dark svg {
  width: 18px;
  height: 18px;
}

.toggle-dark .dark,
.dark .toggle-dark .light {
  display: none;
}

.dark .toggle-dark .dark {
  display: inline-block;
}

.links button,
.links button a {
  color: var(--btn);
}

.links button:hover,
.links button:hover a {
  color: var(--highlight);
}

.versions {
  display: none;
  position: absolute;
  left: 40px;
  top: 40px;
  background-color: var(--bg-light);
  border: 1px solid var(--border);
  border-radius: 4px;
  list-style-type: none;
  padding: 8px;
  margin: 0;
  max-height: calc(100vh - 70px);
  overflow: scroll;
}

.versions a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
  cursor: pointer;
  color: var(--base);
}

.versions a:hover {
  color: var(--green);
}

.versions.expanded {
  display: block;
}

.links > * {
  display: flex;
  align-items: center;
}

.links > * + * {
  margin-left: 4px;
}
</style>
