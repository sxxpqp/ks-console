import React from 'react'
import { get } from 'lodash'

import { Modal } from 'components/Base'

import ContainerLog from 'components/Cards/ContainerLog'

import KubeKeyClusterStore from 'stores/cluster/kubekey'

import { observer } from 'mobx-react'
import styles from './index.scss'

@observer
export default class NodeLogModal extends React.Component {
  kubekeyClusterStore = new KubeKeyClusterStore()

  componentDidMount() {
    this.fetchPod()
  }

  fetchPod = () => {
    const kkName = get(this.props, 'detail.kkName')
    if (kkName) {
      this.kubekeyClusterStore.fetchDetail({ name: kkName })
    }
  }

  renderContent() {
    const { namespace, pods } = get(
      this.kubekeyClusterStore.detail,
      'status.jobInfo',
      {}
    )
    const podName = get(pods, '[0].name')
    const containerName = get(pods, '[0].containers[0].name')

    return (
      <ContainerLog
        className={styles.containerLog}
        contentClassName={styles.containerLogContent}
        namespace={namespace}
        podName={podName}
        containerName={containerName}
        isRealtime
      />
    )
  }

  render() {
    const { visible, onCancel } = this.props
    return (
      <Modal
        bodyClassName={styles.body}
        title={t('Logs')}
        visible={visible}
        onCancel={onCancel}
        fullScreen
        hideFooter
      >
        {this.renderContent()}
      </Modal>
    )
  }
}
