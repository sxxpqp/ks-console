import React from 'react'
import PropTypes from 'prop-types'

import { Controller as Base } from 'components/Cards/Monitoring'
import { Button, Icon, Loading } from '@kube-design/components'
import { Modal } from 'components/Base'

import styles from './index.scss'

export default class MonitoringModalController extends Base {
  static propTypes = {
    ...Base.propTypes,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    ...Base.defaultProps,
    times: 100,
    step: '5m',
    onCancel() {},
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && this.props.visible !== prevProps.visible) {
      this.initParams(this.props)
      this.props.onFetch(this.params)
    }
  }

  componentDidMount() {
    if (this.props.visible) {
      this.props.onFetch(this.params)
    }
  }

  init() {
    this.initParams(this.props)
  }

  renderCustomActions() {
    const { onCancel } = this.props

    return (
      <Button className={styles.button} onClick={onCancel}>
        <Icon type="light" name="close" size={20} />
      </Button>
    )
  }

  renderHeader() {
    const { icon, title } = this.props

    return (
      <div className={styles.header}>
        <div className={styles.title}>
          <Icon name={icon || 'monitor'} size={16} />
          {title || t('Monitoring')}
        </div>
        {this.renderOperations()}
      </div>
    )
  }

  renderContent() {
    const content = Base.prototype.renderContent.call(this)
    return <div className={styles.content}>{content}</div>
  }

  render() {
    const { loading, onFetch, ...rest } = this.props

    return (
      <Modal
        width={1162}
        bodyClassName={styles.body}
        icon="monitor"
        onOk={this.handleSubmit}
        hideHeader
        hideFooter
        fullScreen
        {...rest}
      >
        {this.renderHeader()}
        <Loading spinning={loading}>{this.renderContent()}</Loading>
      </Modal>
    )
  }
}
