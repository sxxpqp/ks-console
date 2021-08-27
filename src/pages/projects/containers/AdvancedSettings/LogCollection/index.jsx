import React from 'react'
import classNames from 'classnames'
import { get } from 'lodash'

import { observer } from 'mobx-react'
import { Alert, Icon } from '@kube-design/components'
import { Switch, Panel, Modal } from 'components/Base'

import styles from './index.scss'

@observer
class LogCollection extends React.Component {
  state = {
    showCloseConfirm: false,
  }

  get canEdit() {
    return this.props.actions.includes('manage')
  }

  handleSwitch = () => {
    const { detail } = this.props.store
    const isOpen =
      get(detail, 'labels["logging.kubesphere.io/logsidecar-injection"]') ===
      'enabled'

    if (isOpen) {
      return this.setState({ showCloseConfirm: true })
    }

    return this.handleToggle()
  }

  handleToggle = () => {
    const { detail } = this.props.store
    const isOpen =
      get(detail, 'labels["logging.kubesphere.io/logsidecar-injection"]') ===
      'enabled'

    this.props.store
      .patch(detail, {
        metadata: {
          labels: {
            'logging.kubesphere.io/logsidecar-injection': isOpen
              ? 'disabled'
              : 'enabled',
          },
        },
      })
      .then(() => {
        this.hideCloseConfirm()
        this.props.store.fetchDetail({
          namespace: detail.name,
          cluster: detail.cluster,
        })
      })
  }

  hideCloseConfirm = () => {
    this.setState({ showCloseConfirm: false })
  }

  render() {
    const { showCloseConfirm } = this.state
    const { detail } = this.props.store
    const isOpen =
      get(detail, 'labels["logging.kubesphere.io/logsidecar-injection"]') ===
      'enabled'

    return (
      <>
        <Panel title={t('Disk Log Collection')}>
          <div className={styles.header}>
            <Icon name="log" size={40} />
            <div className={styles.item}>
              <div>{isOpen ? t('Opened') : t('Closed')}</div>
              <p>{t('Disk Log Collection')}</p>
            </div>
            {this.canEdit && (
              <div className={classNames(styles.item, 'text-right')}>
                <Switch
                  type="control"
                  text={isOpen ? t('Opened') : t('Closed')}
                  onChange={this.handleSwitch}
                  checked={isOpen}
                />
              </div>
            )}
          </div>
          <Alert message={t('COLLECTING_FILE_LOG_DESC')} hideIcon />
        </Panel>
        {this.canEdit && (
          <Modal
            visible={showCloseConfirm}
            onOk={this.handleToggle}
            onCancel={this.hideCloseConfirm}
            width={520}
            hideHeader
          >
            <div className={styles.modalHeader}>
              <Icon
                name="question"
                size={40}
                color={{
                  primary: '#fff',
                  secondary: '#329dce',
                }}
              />
              <div className={styles.title}>
                <div>{t('Are you sure to disable it?')}</div>
                <p>
                  {t(
                    'Disk Log Collection of the project is about to be disabled.'
                  )}
                </p>
              </div>
            </div>
            <div>{t.html('CLOSE_FILE_LOG_TIP')}</div>
          </Modal>
        )}
      </>
    )
  }
}

export default LogCollection
