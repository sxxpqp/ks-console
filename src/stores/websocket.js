import { action, observable } from 'mobx'
import { getWebSocketProtocol, getClusterUrl } from 'utils'
import SocketClient from 'utils/socket.client'

export default class WebSocketStore {
  @observable
  message = {}

  watch(url) {
    if (this.wsClient) {
      this.wsClient.close(true)
    }

    this.wsClient = new SocketClient(
      `${getWebSocketProtocol(window.location.protocol)}://${
        window.location.host
      }${getClusterUrl(`/${url}`)}`,
      {
        onmessage: this.receive,
      }
    )
  }

  @action
  receive = data => {
    this.message = data
  }

  close() {
    if (this.wsClient) {
      this.wsClient.close(true)
    }
  }
}
