import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Form, Input, TextArea } from '@kube-design/components'
import { Modal } from 'components/Base'
import { PATTERN_NAME } from 'utils/constants'

import WorkspaceMemberStore from 'stores/user'

@observer
export default class DevOpsEditModal extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    isSubmitting: false,
    detail: {},
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.form = React.createRef()

    this.store = new WorkspaceMemberStore()
    if (props.workspace) {
      this.store.fetchList({
        limit: Infinity,
        workspace: props.workspace,
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { detail, workspace } = this.props
    if (detail.name && detail.name !== get(prevProps, 'detail.name')) {
      this.store.fetchList({
        limit: Infinity,
        workspace,
      })
    }
  }

  handleOk = data => {
    const { onOk } = this.props
    onOk(data)
  }

  render() {
    const { detail, visible, onCancel, isSubmitting } = this.props

    return (
      <Modal.Form
        width={691}
        title={t('Edit Info')}
        icon="pen"
        data={detail}
        onOk={this.handleOk}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        visible={visible}
      >
        <Form.Item
          label={t('DevOps Name')}
          desc={t('NAME_DESC')}
          rules={[
            { required: true, message: t('Please input name') },
            { pattern: PATTERN_NAME, message: t('PATTERN_NAME_INVALID_TIP') },
          ]}
        >
          <Input name="name" disabled />
        </Form.Item>
        <Form.Item label={t('Creator')} desc={t('DEVOPS_ADMIN_DESC')}>
          <Input name="creator" disabled />
        </Form.Item>
        <Form.Item label={t('Alias')} desc={t('ALIAS_DESC')}>
          <Input name="aliasName" maxLength={63} />
        </Form.Item>
        <Form.Item label={t('Description')} desc={t('DESCRIPTION_DESC')}>
          <TextArea maxLength={256} name="description" />
        </Form.Item>
      </Modal.Form>
    )
  }
}
