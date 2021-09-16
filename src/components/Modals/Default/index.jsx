import React from 'react'
import PropTypes from 'prop-types'

import { Icon } from '@kube-design/components'
import { Modal } from 'components/Base'

import styles from './index.scss'

export default class RedeployModal extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
    isSubmitting: false,
  }

  render() {
    const { desc, title, ...rest } = this.props

    return (
      <Modal width={520} hideHeader {...rest}>
        <div className={styles.wrapper}>
          <Icon name="question" size={40} />
          <div className={styles.text}>
            <div>{title} ?</div>
            <p>{desc} </p>
          </div>
        </div>
      </Modal>
    )
  }
}
