import type { MarkedExtension, Token, Tokens } from 'marked'

function getLang(lang: string) {
  return (lang || '').match(/\S*/)?.[0]
}

function updateToken(token: any) {
  return (code: any) => {
    if (typeof code === 'string' && code !== token.text) {
      token.escaped = true
      token.text = code
    }
  }
}

// copied from marked helpers
const escapeTest = /[&<>"']/
const escapeReplace = new RegExp(escapeTest.source, 'g')
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g')
const escapeReplacements: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}
const getEscapeReplacement = (ch: any) => escapeReplacements[ch]
export function escape(html: string, encode?: boolean) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement)
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement)
    }
  }

  return html
}

/**
 * A synchronous function to highlight code
 *
 * @param code The raw code to be highlighted
 * @param language The language tag found immediately after the code block
 *   opening marker (e.g. ```typescript -> language='typescript')
 * @param info The full string after the code block opening marker
 *   (e.g. ```ts twoslash -> info='ts twoslash')
 * @return The highlighted code as a HTML string
 */
type SyncHighlightFunction = (
  code: string,
  language: string,
  info: string
) => string

/**
 * An asynchronous function to highlight code
 *
 * @param code The raw code to be highlighted
 * @param language The language tag found immediately after the code block
 *   opening marker (e.g. ```typescript -> language='typescript')
 * @param info The full string after the code block opening marker
 *   (e.g. ```ts twoslash -> info='ts twoslash')
 * @return A Promise for the highlighted code as a HTML string
 */
type AsyncHighlightFunction = (
  code: string,
  language: string,
  info: string
) => Promise<string>

/**
 * Options for configuring the marked-highlight extension using a synchronous
 * highlighting function.
 */
interface SynchronousOptions {
  /** Function to highlight code with */
  highlight: SyncHighlightFunction
  /**
   * Not necessary when using a synchronous highlighting function, but can be
   * set without harm (it will make `marked.parse()` return a promise if true;
   * pass the {async: true} option to marked.parse() to tell TypeScript this)
   */
  async?: boolean
  /**
   * The language tag found immediately after the code block opening marker is
   * appended to this to form the class attribute added to the <code> element.
   */
  langPrefix?: string
}

/**
 * Options for configuring the marked-highlight extension using an
 * asynchronous highlighting function.
 *
 * Note that the {async: true} option should also be passed to marked.parse()
 * when using an asynchronous highlighting function to tell TypeScript that it
 * will return a Promise.
 */
interface AsynchronousOptions {
  /** Function to highlight code with */
  highlight: AsyncHighlightFunction
  /** Must be set to true when using an asynchronous highlight function */
  async: true
  /**
   * The language tag found immediately after the code block opening marker is
   * appended to this to form the class attribute added to the <code> element.
   */
  langPrefix?: string
}

/**
 * Configures a marked extension to apply syntax highlighing to code elements.
 *
 * @param options Options for the extension
 * @return A MarkedExtension to be passed to `marked.use()`
 */
export function markedHighlight(
  options: SynchronousOptions
): import('marked').MarkedExtension

/**
 * Configures a marked extension to apply syntax highlighing to code elements.
 *
 * @param options Options for the extension
 * @return A MarkedExtension to be passed to `marked.use()`
 */
export function markedHighlight(
  options: AsynchronousOptions
): import('marked').MarkedExtension

/**
 * Configures a marked extension to apply syntax highlighing to code elements.
 *
 * @param highlightFunction A synchronous function to apply syntax highlighting
 * @return A MarkedExtension to be passed to `marked.use()`
 */
export function markedHighlight(
  highlightFunction: SyncHighlightFunction
): import('marked').MarkedExtension

export function markedHighlight(options: any) {
  if (typeof options === 'function') {
    options = {
      highlight: options
    }
  }

  if (!options || typeof options.highlight !== 'function') {
    throw new Error('Must provide highlight function')
  }

  if (typeof options.langPrefix !== 'string') {
    options.langPrefix = 'language-'
  }

  return {
    async: !!options.async,
    walkTokens(token: Token) {
      if (token.type !== 'code') {
        return
      }

      const lang = getLang(token.lang)

      if (options.async) {
        return Promise.resolve(
          options.highlight(token.text, lang, token.lang || '')
        ).then(updateToken(token))
      }

      const code = options.highlight(token.text, lang, token.lang || '')
      if (code instanceof Promise) {
        throw new Error(
          'markedHighlight is not set to async but the highlight function is async. Set the async option to true on markedHighlight to await the async highlight function.'
        )
      }
      updateToken(token)(code)
    },

    renderer: {
      code({ text, lang, escaped }: Tokens.Code) {
        text = text.replace(/\n$/, '')
        return escaped ? text : escape(text, true)
      }
    }
  } satisfies MarkedExtension
}
