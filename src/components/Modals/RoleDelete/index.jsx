import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { isEmpty } from 'lodash'

import { Modal } from 'components/Base'

import UserStore from 'stores/user'
import GroupStore from 'stores/group'

import { ROLE_QUERY_KEY } from 'utils/constants'

import styles from './index.scss'

@observer
export default class RoleDeleteModal extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    module: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    detail: {},
    visible: false,
    isSubmitting: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      users: [],
      groups: {},
      isLoading: false,
    }

    this.store = new UserStore()
    this.groupStore = new GroupStore()
  }

  componentDidMount() {
    const { visible, detail } = this.props

    if (visible && detail.name) {
      this.fetchData()
    }
  }

  async fetchData() {
    const {
      module,
      detail: { name },
      cluster,
      workspace,
      namespace,
    } = this.props
    this.setState({ isLoading: true })
    const users = await this.store.fetchList({
      [ROLE_QUERY_KEY[module]]: name,
      cluster,
      workspace,
      namespace,
    })
    if (isEmpty(users) && workspace) {
      const groups = await this.groupStore.getWorksapceRoleBinding('', {
        cluster,
        workspace,
        namespace,
        rolename: name,
      })
      this.setState({ groups })
    }
    this.setState({ users, isLoading: false })
  }

  render() {
    const { detail, visible, onOk, onCancel, isSubmitting } = this.props
    const { users, groups, isLoading } = this.state

    return (
      <Modal
        width={504}
        onOk={isLoading || users.length || groups.totalItems ? null : onOk}
        onCancel={onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
        okButtonType="danger"
        hideHeader
      >
        <div className={styles.body}>
          <div className="h5">{t('Sure to delete')}</div>
          <p>
            {!isLoading && users.length
              ? t.html(`ROLE_USER${users.length > 1 ? 'S' : ''}_TIP`, {
                  count: users.length,
                })
              : groups.totalItems
              ? t.html('ROLE_USER_GROUPS_TIP', { count: groups.totalItems })
              : t.html('DELETE_ROLE_TIP', { resource: detail.name })}
          </p>
        </div>
      </Modal>
    )
  }
}
