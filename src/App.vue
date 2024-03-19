<script setup lang="ts">
import { Repl } from '@vue/repl';
import CodeMirror from '@vue/repl/codemirror-editor';
import { watchEffect } from 'vue';

const testData ={}
</script>

<template>
    <Repl
    :editor="CodeMirror"
    :store="testData"
    :show-import-map="false"
    :show-ts-config="false"
    @keydown.ctrl.s.prevent
    @keydown.meta.s.prevent
  />
</template>

<style>
</style>
