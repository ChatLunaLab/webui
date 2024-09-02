import { Marked } from 'marked'
import hljs from 'highlight.js'
import { markedHighlight, escape } from './markedHighlight'

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      const html = hljs.highlight(code, { language }).value

      return `
        <div class="relative  py-3">
          <div class="header flex justify-between items-center px-2 py-1 bg-gray-300 dark:bg-gray-900 rounded-t-xl overflow-hidden">
            <code class="language-label text-xs ">${language}</code>
            <button data-clipboard-text="${escape(code)}"  class="copy-btn text-xs mr-2">Copy</button>
          </div>
          <div>
            <pre><code class="rounded-b-xl hljs language-${language}">${html}</code></pre>
          </div>
        </div>

      `
    }
  })
)

// 导出 md 方法
export const md = (content: string) => {
  return marked.parse(content, {
    async: true,
    gfm: true,
    breaks: false,
    pedantic: false
  })
}
