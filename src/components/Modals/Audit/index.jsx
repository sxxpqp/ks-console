import React from 'react'
import PropTypes from 'prop-types'

import { Button, Icon, Input } from '@kube-design/components'
import { Modal } from 'components/Base'

import styles from './index.scss'

export default class DeleteModal extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    resource: PropTypes.string,
    visible: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    desc: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    isSubmitting: false,
    onOk() {},
    onCancel() {},
  }

  state = {
    confirm: '',
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && this.props.visible !== prevProps.visible) {
      this.setState({ confirm: '' })
    }
  }

  handleInputChange = e => {
    this.setState({ confirm: e.target.value })
  }

  handleOk = () => {
    const { confirm } = this.state
    this.props.onOk(confirm)
  }

  render() {
    const {
      type,
      resource,
      visible,
      onCancel,
      title,
      desc,
      isSubmitting,
      reason,
    } = this.props

    return (
      <Modal
        width={504}
        bodyClassName={styles.modalBody}
        visible={visible}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        hideHeader
        hideFooter
      >
        <div className={styles.body}>
          <div className="h5">
            <Icon name="close" type="light" className={styles.closeIcon} />
            {title || t('DELETE_TITLE', { type })}
          </div>
          <div className={styles.content}>
            <p>{desc}</p>
            <p>申请理由：{reason}</p>
            {resource && (
              <Input
                name="confirm"
                value={this.state.confirm}
                onChange={this.handleInputChange}
                placeholder="请输入驳回的理由"
                autoFocus={true}
              />
            )}
          </div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onCancel} data-test="modal-cancel">
            {t('Cancel')}
          </Button>
          <Button
            type="danger"
            loading={isSubmitting}
            disabled={isSubmitting || this.state.confirm.trim() === ''}
            onClick={this.handleOk}
            data-test="modal-ok"
          >
            {t('OK')}
          </Button>
        </div>
      </Modal>
    )
  }
}
