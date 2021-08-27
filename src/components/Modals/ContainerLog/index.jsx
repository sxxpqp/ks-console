import React from 'react'

import { get } from 'lodash'
import { Modal, Card, Empty } from 'components/Base'

import ContainerLog from 'components/Cards/ContainerLog'

import styles from './index.scss'

export default class ContainerLogModal extends React.Component {
  renderContent() {
    const { namespace, name } = this.props.container
    const { cluster, podName } = this.props

    if (!get(this.props, 'container.containerID')) {
      return (
        <Card>
          <Empty desc={'CONTAINER_REAL_TIME_LOGS_UNSUPPORTED_TIPS'} />
        </Card>
      )
    }

    return (
      <ContainerLog
        className={styles.containerLog}
        contentClassName={styles.containerLogContent}
        namespace={namespace}
        podName={podName}
        cluster={cluster}
        containerName={name}
      />
    )
  }

  render() {
    const { visible, onCancel } = this.props

    return (
      <Modal
        bodyClassName={styles.body}
        title={t('Container Logs')}
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
