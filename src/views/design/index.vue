<template>
  <!-- Block: design-layout -->
  <div class="design-layout">
    <!-- Element: header -->
    <div class="design-layout__header">
      <!-- <header-component @change-Mode="changeMode"></header-component> -->
      <WorkspaceHeader></WorkspaceHeader>
    </div>
    <!-- Element: body -->
    <div class="design-layout__body">
      <!-- Element: components-panel -->
      <div class="design-layout__components-panel">
        <!-- <modules-component></modules-component> -->
        <ComponentPalette></ComponentPalette>
      </div>
      <!-- Element: canvas-panel -->
      <div class="design-layout__canvas-panel" :style="modeStyle">
        <!-- <canvas-error-component v-if="canvas.canvasWarning"></canvas-error-component> -->
        <div class="design-layout__canvas-panel__body">
          <!-- <canvas-component></canvas-component> -->
          <Artboard></Artboard>
        </div>
      </div>
      <!-- Element: attribute-panel -->
      <div class="design-layout__attribute-panel">
        <!-- <attribute-component></attribute-component> -->
        <Inspector></Inspector>
      </div>
    </div>
  </div>
</template>

<script setup>
import WorkspaceHeader from './components/WorkspaceHeader/index.vue' //
import ComponentPalette from './components/ComponentPalette/index.vue' //
import Artboard from './components/Artboard/index.vue' //
import Inspector from './components/Inspector/index.vue' //

import { ref, reactive, onMounted, defineComponent } from 'vue'
import { useSystemStore } from '@/stores/index'
import { storeToRefs } from 'pinia'
defineOptions({
  name: 'design'
})
const { modeStyle } = storeToRefs(useSystemStore())
</script>

<style scoped></style>
