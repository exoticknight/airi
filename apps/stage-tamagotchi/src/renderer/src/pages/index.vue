<script setup lang="ts">
import { WidgetStage } from '@proj-airi/stage-ui/components'
import { computed } from 'vue'

import InteractiveArea from '../components/InteractiveArea.vue'
import { useWindowShortcuts } from '../composables/window-shortcuts'
import { useWindowControlStore } from '../stores/window-controls'
import { WindowControlMode } from '../types/window-controls'

const windowStore = useWindowControlStore()
useWindowShortcuts()

function handleMouseDown(event: MouseEvent) {
  if (!windowStore.isControlActive || windowStore.controlMode !== WindowControlMode.MOVE)
    return

  window.electron.ipcRenderer.send('start-window-drag', event.x, event.y)
}

function handleMouseUp() {
  if (windowStore.controlMode === WindowControlMode.MOVE) {
    window.electron.ipcRenderer.send('end-window-drag')
  }
}

const modeIndicatorClass = computed(() => {
  switch (windowStore.controlMode) {
    case WindowControlMode.MOVE:
      return 'cursor-move'
    case WindowControlMode.RESIZE:
      return 'cursor-se-resize'
    case WindowControlMode.DEBUG:
      return 'debug-mode'
    default:
      return ''
  }
})
</script>

<template>
  <div
    :class="[modeIndicatorClass]"
    relative
    max-h="[100vh]"
    max-w="[100vw]"
    p="2"
    flex="~ col"
    z-2
    h-full
    overflow-hidden
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <div relative h-full w-full items-end gap-2 class="view">
      <WidgetStage h-full w-full flex-1 mb="<md:18" />
      <InteractiveArea
        class="interaction-area block"
        :class="{ 'pointer-events-none': !windowStore.isControlActive }"
        absolute bottom-0 w-full transition="opacity duration-250" op-0
      />
    </div>

    <!-- Debug Mode UI -->
    <div v-if="windowStore.controlMode === WindowControlMode.DEBUG" class="debug-controls">
      <!-- Add debug controls here -->
    </div>
  </div>
</template>

<style scoped>
.view {
  &:hover {
    .interaction-area {
      opacity: 1;
      pointer-events: auto;
    }
  }
}
</style>
