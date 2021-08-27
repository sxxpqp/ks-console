import React, { lazy, Suspense, Component } from 'react'
import { observer } from 'mobx-react'
import { getWebSocketProtocol, getClusterUrl } from 'utils'

const ContainerTerminal = lazy(() =>
  import(/* webpackChunkName: "terminal" */ './terminal')
)

const BG_COLOR = '#181d28'

@observer
export default class SessionTerminal extends Component {
  get url() {
    return `${getWebSocketProtocol(window.location.protocol)}://${
      window.location.host
    }${getClusterUrl(`/${this.props.url}`)}`
  }

  resizeTerminal = () => {
    this.terminalRef && this.terminalRef.onResize()
  }

  render() {
    if (!this.props.url) {
      return null
    }

    const terminalOpts = {
      theme: {
        background: BG_COLOR,
      },
    }

    return (
      <div
        style={{
          height: '100%',
          borderRadius: '4px',
          background: BG_COLOR,
          padding: '12px',
          color: '#fff',
        }}
      >
        <Suspense fallback={'Loading'}>
          {this.props.isLoading ? (
            'Loading'
          ) : (
            <ContainerTerminal
              websocketUrl={this.url}
              key={this.url}
              terminalOpts={terminalOpts}
              ref={ref => {
                this.terminalRef = ref
              }}
            />
          )}
        </Suspense>
      </div>
    )
  }
}
