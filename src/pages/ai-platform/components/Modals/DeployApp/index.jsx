import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'
import { Modal } from 'components/Base'

import styles from './index.scss'

const Item = ({ icon, image, title, desc, disabled, onEnter }) => (
  <div
    className={classNames(styles.item, { [styles.disable]: disabled })}
    onClick={onEnter}
  >
    {image ? <img src={image} alt="" /> : <Icon name={icon} size={40} />}
    <div className={styles.text}>
      <div>{title}</div>
      <p>{desc}</p>
    </div>
  </div>
)

export default class DeployAppModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
  }

  handleAppTemplate = () => {
    const { namespace, cluster, workspace, routing, onOk } = this.props
    onOk()
    routing.push(
      `/apps?workspace=${workspace}&cluster=${cluster}&namespace=${namespace}`
    )
  }

  handleAppRepo = () => {
    const { onOk, trigger, ...rest } = this.props
    onOk()
    trigger('openpitrix.app.create', {
      trigger,
      ...rest,
    })
  }

  render() {
    const { visible, onCancel } = this.props

    return (
      <Modal
        width={600}
        style={{ borderRadius: '8px' }}
        onOk={this.handleOk}
        onCancel={onCancel}
        visible={visible}
        bodyClassName={styles.body}
        hideHeader
      >
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src="/assets/application.svg" alt="" />
          </div>
          <div className={styles.text}>
            <h2>{t('Deploy New Application')}</h2>
            <p>{t('APP_DEPLOYMENT_DESC')}</p>
          </div>
        </div>

        <div className={styles.footer}>
          {globals.app.enableAppStore && (
            <Item
              icon="templet"
              title={t('From App Store')}
              desc={t('FROM_APP_STORE_DESC')}
              onEnter={this.handleAppTemplate}
            />
          )}
          <Item
            icon="catalog"
            title={t('From App Templates')}
            desc={t('FROM_APP_TEMPLATES_DESC')}
            onEnter={this.handleAppRepo}
          />
        </div>
      </Modal>
    )
  }
}
