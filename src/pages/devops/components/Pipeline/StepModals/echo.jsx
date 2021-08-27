import React from 'react'
import PropTypes from 'prop-types'
import { Form, TextArea } from '@kube-design/components'
import { Modal } from 'components/Base'
import styles from './index.scss'

export default class Echo extends React.Component {
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
    if (nextProps.edittingData.type === 'echo') {
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
          value: formData[key].trim(),
        },
      }))
      this.props.onAddStep({
        name: 'echo',
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
        title={t('Print message')}
      >
        <Form data={this.state.formData} ref={this.formRef}>
          <Form.Item
            label={t('message')}
            rules={[
              { required: true, message: t('This parameter is required') },
            ]}
          >
            <TextArea name="message" />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
