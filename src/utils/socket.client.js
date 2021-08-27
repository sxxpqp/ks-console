import { get } from 'lodash'
import { getWebSocketProtocol } from 'utils'

const readyStates = ['connecting', 'open', 'closing', 'closed']
const defaultOptions = {
  reopenLimit: 5,
  onopen() {},
  onmessage() {},
  onclose() {},
  onerror() {},
}

export default class SocketClient {
  static composeEndpoint = (socketUrl, suffix = '') => {
    const re = /(\w+?:\/\/)?([^\\?]+)/
    const matchParts = String(socketUrl).match(re)
    return `${getWebSocketProtocol(window.location.protocol)}://${
      matchParts[2]
    }${suffix}`
  }

  constructor(endpoint, options = {}) {
    this.endpoint = endpoint
    this.options = Object.assign(defaultOptions, options)

    if (!this.endpoint) {
      throw Error(`invalid websocket endpoint: ${this.endpoint}`)
    }
    this.reopenCount = 0
    this.setUp()
  }

  getSocketState(readyState) {
    if (readyState === undefined) {
      readyState = this.client.readyState
    }

    return readyStates[readyState]
  }

  initClient() {
    const subProto = get(this.options, 'subProtocol')

    if (!this.client) {
      this.client = new WebSocket(this.endpoint, subProto)
    }

    if (this.client && this.client.readyState > 1) {
      this.client.close()
      this.client = new WebSocket(this.endpoint, subProto)
    }

    return this.client
  }

  attachEvents() {
    const { onopen, onmessage, onclose, onerror } = this.options

    this.client.onopen = ev => {
      onopen && onopen(ev)
    }

    this.client.onmessage = message => {
      let { data } = message
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch (e) {}
      }

      onmessage && onmessage(data)
    }

    this.client.onclose = ev => {
      // if socket will close, try to keep alive
      if (!this.immediately && this.reopenCount < this.options.reopenLimit) {
        setTimeout(this.setUp.bind(this), 1000 * 2 ** this.reopenCount)
        this.reopenCount++
      }

      onclose && onclose(ev)
    }

    this.client.onerror = ev => {
      console.error('socket error: ', ev)
      onerror && onerror(ev)
    }
  }

  send(data) {
    return this.client.send(data)
  }

  close(val) {
    val && (this.immediately = true)
    this.client.close()
  }

  setUp() {
    this.initClient()
    this.attachEvents()
  }
}
