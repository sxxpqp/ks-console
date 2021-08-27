import React from 'react'
import PropTypes from 'prop-types'
import copy from 'fast-copy'

import { Column, Columns, Form, Input } from '@kube-design/components'
import { Modal } from 'components/Base'

import styles from './index.scss'

export default class OAuthModal extends React.Component {
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

  constructor(props) {
    super(props)

    this.state = {
      formData: copy(props.detail),
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && this.props.visible !== prevProps.visible) {
      this.setState({ formData: copy(this.props.detail) })
    }
  }

  render() {
    const { visible, isSubmitting, onOk, onCancel } = this.props
    const { formData } = this.state

    return (
      <Modal.Form
        data={formData}
        width={960}
        title={'OAuth'}
        description={t('OAUTH_DESC')}
        icon="safe-notice"
        onOk={onOk}
        onCancel={onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
      >
        <Columns className={styles.content}>
          <Column>
            <Form.Item
              label={t('Name')}
              rules={[{ required: true, message: t('Please input name') }]}
            >
              <Input name="name" />
            </Form.Item>
            <Form.Item
              label={t('Client ID')}
              rules={[{ required: true, message: t('Please input client id') }]}
            >
              <Input name="clientID" />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item
              label={t('Server Address')}
              rules={[
                { required: true, message: t('Please input server address') },
              ]}
            >
              <Input name="server" />
            </Form.Item>
            <Form.Item label={t('Client Secret')}>
              <Input name="secret" />
            </Form.Item>
          </Column>
        </Columns>
      </Modal.Form>
    )
  }
}
