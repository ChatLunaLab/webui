export class TypeWriter {
  // 打字机队列
  private _queue: string[] = []

  private _isRunning = false

  constructor(
    private _speed: number = 40,
    private _maxLength = 200
  ) {}

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
        console.log(this._isRunning, this._queue.length)
        await new Promise((resolve) => setTimeout(resolve, 100))
        continue
      }
      const text = this._queue.shift()!
      // Convert the string into an array of valid Unicode scalar values
      const chars = Array.from(text)
      // Process each character
      for (let i = 0; i < chars.length; i++) {
        callback(chars[i])
        await new Promise((resolve) => setTimeout(resolve, this._speed))
      }
    }
    console.log('done??')
    callback('[DONE]')
    this._queue.length = 0
  }

  done() {
    this._isRunning = false
  }
}
