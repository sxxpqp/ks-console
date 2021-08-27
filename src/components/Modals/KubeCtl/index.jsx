import React from 'react'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import { get } from 'lodash'

import { TypeSelect } from 'components/Base'
import ContainerTerminal from 'components/Terminal'
import UserTip from 'components/Cards/Tips'
import fullScreen from 'components/Modals/FullscreenModal'
import TerminalStore from 'stores/terminal'
import ClusterStore from 'stores/cluster'
import { CLUSTER_PROVIDER_ICON } from 'utils/constants'
import { observable } from 'mobx'
import styles from './index.scss'

@fullScreen
@observer
export default class KubeCtlModal extends React.Component {
  state = {
    cluster: this.props.cluster || '',
  }

  store = new TerminalStore()

  clusterStore = new ClusterStore()

  terminalRef = React.createRef()

  @observable
  url = ''

  componentDidMount() {
    this.fetchData()
  }

  get clusters() {
    return this.clusterStore.list.data
      .filter(item => item.isReady)
      .map(item => ({
        label: item.name,
        value: item.name,
        icon: CLUSTER_PROVIDER_ICON[item.provider] || 'kubernetes',
        version: get(item, 'configz.ksVersion'),
        description: item.provider,
      }))
  }

  async fetchData() {
    if (!globals.app.isMultiCluster) {
      this.getKubeWebUrl()
      return
    }

    let cluster = this.props.cluster

    if (!cluster) {
      await this.clusterStore.fetchListByK8s()
      cluster = get(this.clusters, '[0].value')
      this.setState({ cluster }, () => {
        this.getKubeWebUrl(cluster)
      })
    } else {
      this.getKubeWebUrl(cluster)
    }
  }

  handleClusterChange = cluster => {
    this.setState({ cluster }, () => {
      this.getKubeWebUrl(cluster)
    })
  }

  onTipsToggle = () => {
    const { current } = this.terminalRef
    current && current.resizeTerminal()
  }

  getKubeWebUrl = async cluster => {
    await this.store.fetchKubeCtl({ cluster })
    this.url = await this.store.kubeWebsocketUrl()
  }

  render() {
    return (
      <UserTip
        wrapperClassName={styles.kubectl}
        onToggleTip={this.onTipsToggle}
        localStorageKey="kubectl-doc"
        article={this.renderTerminal()}
        tips={this.renderTips()}
        onToggle={this.onTipsToggle}
      />
    )
  }

  renderTips() {
    return (
      <div>
        {!this.props.cluster && globals.app.isMultiCluster && (
          <TypeSelect
            options={this.clusters}
            value={this.state.cluster}
            onChange={this.handleClusterChange}
          />
        )}
        <div className={classnames('markdown-body', styles.doc)}>
          {t.html('KUBECTL_TIP')}
        </div>
      </div>
    )
  }

  renderTerminal() {
    return (
      <div className={classnames(styles.pane, styles.terminal)}>
        <ContainerTerminal
          isLoading={this.store.kubectl.isLoading}
          url={this.url}
          ref={this.terminalRef}
        />
      </div>
    )
  }
}
