import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Button, Form } from '@kube-design/components'
import Modal from './modal'

import styles from './index.scss'

export default class ModalForm extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    isSubmitting: PropTypes.bool,
  }

  render() {
    const {
      formRef,
      data,
      children,
      hideFooter,
      onCancel,
      onOk,
      cancelText,
      okText,
      isSubmitting,
      bodyClassName,
      formClassName,
      disableOk,
      ...rest
    } = this.props

    return (
      <Modal
        {...rest}
        bodyClassName={classnames(styles.formBody, bodyClassName)}
        onCancel={onCancel}
        hideFooter
      >
        <Form ref={formRef} data={data} onSubmit={onOk}>
          <div className={classnames(styles.formWrapper, formClassName)}>
            {children}
          </div>
          {!hideFooter && (
            <div className={styles.formFooter}>
              <Button
                type="default"
                onClick={onCancel}
                data-test="modal-cancel"
              >
                {cancelText || t('Cancel')}
              </Button>
              <Button
                type="control"
                htmlType="submit"
                loading={isSubmitting}
                disabled={disableOk || isSubmitting}
                data-test="modal-ok"
              >
                {okText || t('OK')}
              </Button>
            </div>
          )}
        </Form>
      </Modal>
    )
  }
}
