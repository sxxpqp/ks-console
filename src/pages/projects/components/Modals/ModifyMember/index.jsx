import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import { Form, Select } from '@kube-design/components'
import { Modal } from 'components/Base'

import User from './User'

import styles from './index.scss'

@observer
export default class ModifyMemberModal extends React.Component {
  static propTypes = {
    users: PropTypes.array,
    roles: PropTypes.array,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    users: [],
    roles: [],
    visible: false,
    isSubmitting: false,
    onOk() {},
    onCancel() {},
  }

  handleOk = (data = {}) => {
    const { onOk, users } = this.props
    const { role } = data
    onOk(users, role)
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
    const { visible, onCancel, users, isSubmitting } = this.props

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
        <div className="margin-b12">
          {users.map(user => (
            <User key={user.username} user={user} />
          ))}
        </div>
        <Form.Item
          label={t('Role')}
          rules={[{ required: true, message: t('Please select a role') }]}
        >
          <Select
            name="role"
            optionRenderer={this.optionRenderer}
            options={this.getRoleOptions()}
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
