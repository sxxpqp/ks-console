export default class History {
  data = []

  maxLength = 50

  cursor = 0

  constructor(length) {
    if (!isNaN(length)) {
      this.maxLength = length
    }
  }

  push(value) {
    if (this.data.length >= this.maxLength) {
      this.data.shift()
    }
    this.data.push(value)
    this.cursor = 0
  }

  undo() {
    if (this.cursor < this.data.length - 1) {
      this.cursor += 1
    }

    return this.data[this.data.length - 1 - this.cursor]
  }

  redo() {
    if (this.cursor > 0) {
      this.cursor -= 1
    }

    return this.data[this.data.length - 1 - this.cursor]
  }
}
