import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@kube-design/components'
import { Modal } from 'components/Base'

import styles from './index.scss'

export default class SetDefaultStorageClassModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
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

  render() {
    const { visible, onCancel, onOk, isSubmitting } = this.props
    return (
      <Modal
        width={520}
        onOk={onOk}
        onCancel={onCancel}
        visible={visible}
        okText={t('Apply immediately')}
        cancelText={t('Cancel')}
        isSubmitting={isSubmitting}
        hideHeader
      >
        <div className={styles.body}>
          <div className="h5">
            <Icon
              name="information"
              color={{ primary: '#ffffff', secondary: '#41b1ea' }}
              size={18}
            />
            &nbsp;&nbsp;
            {t('Set as default storage class')}
          </div>
          <p>{t('STORAGE_CLASS_SET_DEFAULT_DESC')}</p>
        </div>
      </Modal>
    )
  }
}
