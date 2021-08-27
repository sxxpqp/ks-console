import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import { observer } from 'mobx-react'
import { Modal } from 'components/Base'
import { Form, Input } from '@kube-design/components'

import styles from './index.scss'

@observer
export default class Container extends React.Component {
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

  static getDerivedStateFromProps(props) {
    if (props.edittingData.type === 'container') {
      const formData = {
        name: get(props.edittingData, 'data.value', ''),
      }
      return { formData }
    }
    return null
  }

  handleOk = () => {
    const formData = this.formRef.current.getData()
    this.formRef.current.validate(() => {
      this.props.onAddStep({
        name: 'container',
        arguments: {
          isLiteral: true,
          value: formData.name,
        },
        children: [],
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
        title={t('container')}
      >
        <Form data={this.state.formData} ref={this.formRef}>
          <Form.Item
            label={t('name')}
            rules={[{ required: true, message: t('This param is required') }]}
          >
            <Input name="name" />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
