export class TypeWriter {
  // 打字机队列
  private _queue: string[] = []

  private _isRunning = false

  constructor(private _maxLength = 200) {}

  async write(text: string) {
    if (this._queue.length >= this._maxLength) {
      // wait for the queue to be empty
      while (this._queue.length < this._maxLength) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    this._queue.push(text)
  }

  async start(callback: (text: string) => void) {
    this._isRunning = true
    while (this._isRunning || this._queue.length > 0) {
      if (this._queue.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 10))
        continue
      }
      const text = this._queue.shift()!
      let buffer = ''
      for (const char of text) {
        buffer += char
        if (char === '\n') {
          callback(buffer)
          buffer = ''
        }
      }
      callback(buffer)
    }
    callback('[DONE]')
    this._queue.length = 0
  }

  done() {
    this._isRunning = false
  }
}
