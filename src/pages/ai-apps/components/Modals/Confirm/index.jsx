import React from 'react'
import PropTypes from 'prop-types'

import { Button, Icon } from '@kube-design/components'
import { Modal } from 'components/Base'

import styles from './index.scss'

export default class ConfirmModal extends React.Component {
  static propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    desc: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    visible: PropTypes.bool,
    isSubmitting: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    icon: '',
    title: '',
    description: '',
    content: '',
    visible: false,
    isSubmitting: false,
    onOk() {},
    onCancel() {},
  }

  handleOk = () => {
    this.props.onOk()
  }

  renderTitle() {
    const { icon, title, description } = this.props

    return (
      <div className={styles.title}>
        <Icon name={icon || 'question'} size={description ? 40 : 32} />
        {description ? (
          <div className={styles.description}>
            <h3>{title || t('Note')}</h3>
            <small>{description}</small>
          </div>
        ) : (
          <div className={styles.name}>{title || t('Note')}</div>
        )}
      </div>
    )
  }

  render() {
    const { visible, onCancel, content, isSubmitting } = this.props

    return (
      <Modal
        width={504}
        bodyClassName={styles.modalBody}
        visible={visible}
        isSubmitting={isSubmitting}
        hideHeader
        hideFooter
      >
        <div className={styles.body}>
          {this.renderTitle()}
          <div className={styles.content}>{content}</div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onCancel}>{t('Cancel')}</Button>
          <Button
            type="control"
            disabled={isSubmitting}
            loading={isSubmitting}
            onClick={this.handleOk}
          >
            {t('OK')}
          </Button>
        </div>
      </Modal>
    )
  }
}
