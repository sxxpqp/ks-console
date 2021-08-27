import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import { observer } from 'mobx-react'
import { Modal } from 'components/Base'
import { Form, Input } from '@kube-design/components'

import styles from './index.scss'

@observer
export default class Dir extends React.Component {
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
    if (nextProps.edittingData.type === 'dir') {
      const formData = {
        path: get(nextProps.edittingData, 'data.value', ''),
      }
      return { formData }
    }
    return null
  }

  handleOk = () => {
    const formData = this.formRef.current.getData()
    this.props.onAddStep({
      name: 'dir',
      arguments: {
        isLiteral: true,
        value: formData.path,
      },
      children: [],
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
        title={t('dir')}
      >
        <Form data={this.state.formData} ref={this.formRef}>
          <Form.Item label={t('Path')}>
            <Input name="path" />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
