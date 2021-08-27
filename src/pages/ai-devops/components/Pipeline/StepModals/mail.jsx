import React from 'react'
import PropTypes from 'prop-types'

import { observer } from 'mobx-react'
import { Modal } from 'components/Base'
import { Form, Input, TextArea } from '@kube-design/components'

import styles from './index.scss'

@observer
export default class Mail extends React.Component {
  static propTypes = {
    name: PropTypes.string,
  }

  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = { formData: {} }
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.edittingData.type === 'mail') {
      const formData = nextProps.edittingData.data.reduce((prev, arg) => {
        prev[arg.key] = arg.value.value
        return prev
      }, {})
      return { formData }
    }
    return null
  }

  handleOk = () => {
    const formData = this.formRef.current.getData()
    this.formRef.current.validate(() => {
      const _arguments = Object.keys(formData).map(key => ({
        key,
        value: {
          isLiteral: true,
          value: formData[key],
        },
      }))
      this.props.onAddStep({
        name: 'mail',
        arguments: _arguments.filter(arg => arg.value.value !== ''),
      })
    })
  }

  render() {
    const { visible, onCancel } = this.props

    return (
      <Modal
        width={680}
        bodyClassName={styles.body}
        onCancel={onCancel}
        onOk={this.handleOk}
        visible={visible}
        closable={false}
        title={t('mail')}
      >
        <Form data={this.state.formData} ref={this.formRef}>
          <Form.Item label={t('Recipient')}>
            <Input name="to" />
          </Form.Item>
          <Form.Item label={t('CC')}>
            <Input name="cc" />
          </Form.Item>
          <Form.Item
            label={t('Subject')}
            rules={[{ required: true, message: t('This param is required') }]}
          >
            <Input name="subject" />
          </Form.Item>
          <Form.Item
            label={t('Body')}
            rules={[{ required: true, message: t('This param is required') }]}
          >
            <TextArea name="body" />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
