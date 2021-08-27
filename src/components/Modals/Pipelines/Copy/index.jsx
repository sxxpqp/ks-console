import React from 'react'
import PropTypes from 'prop-types'

import { Form, Input, TextArea } from '@kube-design/components'
import { Modal } from 'components/Base'

import { PATTERN_NAME } from 'utils/constants'

export default class BaseInfoModal extends React.Component {
  static propTypes = {
    formTemplate: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.form = React.createRef()
  }

  handleOk = () => {
    const { onOk } = this.props

    const form = this.form.current
    form &&
      form.validate(() => {
        const formData = form.getData()
        onOk(formData)
      })
  }

  validator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    this.props.store
      .checkPipelineName({
        name: value,
        cluster: this.props.cluster,
        devops: this.props.devops,
      })
      .then(resp => {
        if (resp.exist) {
          return callback({
            field: rule.field,
            message: t('This name has existed.'),
          })
        }
        callback()
      })
  }

  render() {
    const { visible, onCancel, title, icon, formTemplate = {} } = this.props

    return (
      <Modal
        width={691}
        title={title}
        icon={icon}
        onOk={this.handleOk}
        onCancel={onCancel}
        visible={visible}
      >
        <Form ref={this.form} data={formTemplate}>
          <Form.Item
            label={t('Name')}
            desc={t(
              'The name of the pipeline. Pipelines in the same project must have different names.'
            )}
            rules={[
              { required: true, message: t('Please input pipeline name') },
              {
                pattern: PATTERN_NAME,
                message: t('Invalid name', { message: t('NAME_DESC') }),
              },
              { validator: this.validator },
            ]}
          >
            <Input name="name" maxLength={63} />
          </Form.Item>
          <Form.Item label={t('Description')} desc={t('DESCRIPTION_DESC')}>
            <TextArea name="description" maxLength={256} />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
