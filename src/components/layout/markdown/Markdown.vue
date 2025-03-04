<template>
  <div v-copy-btn v-html="markdown"></div>
</template>
<script setup lang="ts">
import { md } from '@/lib/markdown'
import { ref, watch } from 'vue'

const markdown = ref('')

const props = defineProps<{
  source: string
}>()

const renderMarkdown = async () => {
  markdown.value = await md(props.source)
}

function copyEvent(this: HTMLElement, event: Event) {
  const copyText = this.getAttribute('data-clipboard-text')
  if (copyText) {
    this.textContent = 'Copied!'
    navigator.clipboard.writeText(copyText)
    setTimeout(() => {
      this.textContent = 'Copy'
    }, 1000)
  }
}

const vCopyBtn = (el: HTMLElement) => {
  const copyButtons = el.querySelectorAll('.copy-btn')
  copyButtons.forEach((btn) => {
    if (btn.classList.contains('listened')) {
      return
    }
    btn.classList.add('listened')
    btn.addEventListener('click', copyEvent)
  })
}

// Watch for changes in the source prop and re-render markdown
watch(() => props.source, renderMarkdown, { immediate: true })
</script>
