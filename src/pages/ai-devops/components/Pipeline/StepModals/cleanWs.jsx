import React from 'react'
import PropTypes from 'prop-types'

import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { Checkbox, Form } from '@kube-design/components'
import { Modal } from 'components/Base'

import styles from './index.scss'

@observer
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
  }

  @observable
  formData = {}

  handleOk = () => {
    const formData = this.formRef.current.getData()
    const _arguments = Object.keys(formData).map(key => ({
      key,
      value: {
        isLiteral: true,
        value: Array.isArray(formData[key]) ? formData[key][0] : formData[key],
      },
    }))
    this.props.onAddStep({
      name: 'cleanWs',
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
        title={t('cleanWs')}
      >
        <Form data={this.formData} ref={this.formRef}>
          <Form.Item>
            <Checkbox name="cleanWhenAborted" defaultValue={true}>
              {t('Clean when aborted')}
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Checkbox name="notFailBuild" defaultValue={true}>
              {t('Not fail build')}
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
