import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Icon } from '@kube-design/components'
import { Modal } from 'components/Base'
// import { inject, observer } from 'mobx-react'

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
    // console.log(
    //   '🚀 ~ file: index.jsx ~ line 37 ~ DeployAppModal ~ this.props',
    //   this.props
    // )
    this.props.rootStore.saveClusters({
      namespace,
      workspace,
      cluster,
    })
    onOk()
    routing.push({
      pathname: `/apps`,
      state: { prevPath: location.pathname },
    })
  }

  handleAppRepo = () => {
    const { onOk, trigger, ...rest } = this.props
    onOk()
    trigger('openpitrix.app.create', {
      trigger,
      ...rest,
    })
  }

  handleCreateApp = () => {
    const { onOk, trigger, ...rest } = this.props
    debugger
    // this.crdAppStore.fetchDetail(this.props.match.params)
    onOk()
    trigger('crd.app.create', {
      trigger,
      ...rest,
      store: rest.crdAppStore,
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
            <p>{t('TemplateApp')}</p>
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
          <Item
            icon="listview"
            title={'自制应用'}
            desc={
              '容器平台提供全生命周期的应用管理，可以上传或者创建新的应用模板，并且快速部署它们。'
            }
            onEnter={() => this.handleCreateApp()}
          />
        </div>
      </Modal>
    )
  }
}
