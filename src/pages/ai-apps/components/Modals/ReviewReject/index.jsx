import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, TextArea } from '@kube-design/components'

import { Modal } from 'components/Base'

import styles from './index.scss'

export default class ReviewReject extends Component {
  static propTypes = {
    versionId: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    versionId: '',
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)
    this.state = {
      message: '',
    }
  }

  handleReject = () =>
    this.formRef.validate(() =>
      this.props.onOk({
        version_id: this.props.versionId,
        message: this.state.message,
      })
    )

  changeMessage = message => {
    this.setState({ message })
  }

  render() {
    const { visible, ...rest } = this.props
    const formData = { message: this.state.message }

    return (
      <Modal
        width={600}
        visible={visible}
        {...rest}
        onOk={this.handleReject}
        footerClassName={styles.footer}
      >
        <Form
          data={formData}
          ref={form => {
            this.formRef = form
          }}
          className={styles.rejectForm}
        >
          <Form.Item
            rules={[
              { required: true, message: t('Please input reject reason') },
            ]}
          >
            <TextArea name="message" onChange={this.changeMessage} />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
