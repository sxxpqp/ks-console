import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Modal } from 'components/Base'
import { Form, Input } from '@kube-design/components'

import styles from './index.scss'

@observer
export default class ArchiveArtifacts extends React.Component {
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
    if (props.edittingData.type === 'archiveArtifacts') {
      const formData = props.edittingData.data.reduce((prev, arg) => {
        prev[arg.key] = arg.value.value
        return prev
      }, {})
      return { formData }
    }
    return null
  }

  handleOk = () => {
    const formData = this.formRef.current.getData()
    const _arguments = Object.keys(formData).map(key => ({
      key,
      value: { isLiteral: true, value: formData[key] },
    }))
    this.props.onAddStep({
      name: 'archiveArtifacts',
      arguments: _arguments,
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
        title={t('archiveArtifacts')}
      >
        <Form data={this.state.formData} ref={this.formRef}>
          <Form.Item label={t('Artifacts')}>
            <Input name="artifacts" />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
