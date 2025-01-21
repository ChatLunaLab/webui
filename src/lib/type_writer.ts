export class TypeWriter {
  // 打字机队列
  private _queue: string[] = []

  private _isRunning = false

  constructor(
    private _speed: number = 1,
    private _maxLength = 200
  ) {}

  async write(text: string) {
    if (this._queue.length >= this._maxLength) {
      // wait for the queue to be empty
      while (this._queue.length < this._maxLength) {
        await new Promise((resolve) => setTimeout(resolve, 1))
      }
    }

    this._queue.push(text)
  }

  async start(callback: (text: string) => void) {
    this._isRunning = true
    while (this._isRunning || this._queue.length > 0) {
      if (this._queue.length === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1))
        continue
      }
      const text = this._queue.shift()!
      // Convert the string into an array of valid Unicode scalar values

      // Process each \n
      const parts = text.split('\n')
      for (let i = 0; i < parts.length; i++) {
        let part = parts[i]
        if (i !== parts.length - 1) {
          part += '\n'
        }
        callback(part)
        await new Promise((resolve) => setTimeout(resolve, this._speed))
      }
    }

    callback('[DONE]')
    this._queue.length = 0
  }

  done() {
    this._isRunning = false
  }
}
