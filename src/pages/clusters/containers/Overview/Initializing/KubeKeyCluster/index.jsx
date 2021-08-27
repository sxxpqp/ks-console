import React, { Component } from 'react'
import { reaction, toJS } from 'mobx'
import { observer } from 'mobx-react'

import WebsocketStore from 'stores/websocket'

import Progress from './Progress'
import Logs from './Logs'

@observer
export default class KubeKeyCluster extends Component {
  store = this.props.store

  websocket = new WebsocketStore()

  componentDidMount() {
    this.initWebsocket()
  }

  componentWillUnmount() {
    this.websocket.close()
    this.disposer && this.disposer()
  }

  initWebsocket = () => {
    const { name } = this.props

    if (!name) {
      return
    }

    const url = this.store.getWatchUrl({ name })
    if (url) {
      this.websocket.watch(url)

      this.disposer = reaction(
        () => this.websocket.message,
        message => {
          if (message.type === 'MODIFIED' || message.type === 'ADDED') {
            this.store.detail = this.store.mapper(toJS(message.object))
          }
        }
      )
    }
  }

  render() {
    const detail = this.store.detail
    return (
      <div className="padding-12">
        <Progress detail={detail} />
        <Logs detail={detail} />
      </div>
    )
  }
}
