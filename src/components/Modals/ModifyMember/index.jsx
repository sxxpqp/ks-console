import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import { Form, Select } from '@kube-design/components'
import { Modal } from 'components/Base'

import styles from './index.scss'

@observer
export default class ModifyMemberModal extends React.Component {
  static propTypes = {
    role: PropTypes.string,
    roles: PropTypes.array,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    role: '',
    roles: [],
    visible: false,
    isSubmitting: false,
    onOk() {},
    onCancel() {},
  }

  handleOk = (data = {}) => {
    const { onOk } = this.props
    const { role } = data
    onOk(role)
  }

  getRoleOptions = () => {
    const { roles } = this.props
    return roles.map(role => {
      const desc = get(role, 'description')
      return {
        label: role.name,
        value: role.name,
        desc: t(desc),
      }
    })
  }

  optionRenderer = option => (
    <div className={styles.option}>
      <div>{option.label}</div>
      <p>{option.desc}</p>
    </div>
  )

  render() {
    const { visible, onCancel, isSubmitting, role } = this.props

    return (
      <Modal.Form
        width={691}
        title={t('Modify Member Role')}
        icon="role"
        onOk={this.handleOk}
        onCancel={onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
      >
        <Form.Item
          label={t('Role')}
          rules={[{ required: true, message: t('Please select a role') }]}
        >
          <Select
            name="role"
            optionRenderer={this.optionRenderer}
            options={this.getRoleOptions()}
            defaultValue={role}
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
