import React, { Component } from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import { get } from 'lodash'
import { Select } from '@kube-design/components'
import RoleStore from 'stores/role'

import styles from './index.scss'

@observer
export default class RoleSelect extends Component {
  roleStore = new RoleStore()

  componentDidMount() {
    this.props.namespace && this.fetchRoles()
  }

  componentDidUpdate(prevProps) {
    if (this.props.namespace !== prevProps.namespace && this.props.namespace) {
      this.fetchRoles()
    }
  }

  @computed
  get roles() {
    return this.roleStore.list.data.map(role => ({
      label: role.name,
      value: role.name,
      item: role,
      desc: t(get(role, 'description')),
    }))
  }

  fetchRoles = () => {
    const { cluster, namespace } = this.props
    return this.roleStore.fetchList({
      cluster,
      namespace,
      limit: -1,
      sortBy: 'createTime',
    })
  }

  optionRenderer = option => (
    <div className={styles.option}>
      <div>{option.label}</div>
      <p>{option.desc}</p>
    </div>
  )

  render() {
    const { ...rest } = this.props

    return (
      <Select
        options={this.roles}
        optionRenderer={this.optionRenderer}
        {...rest}
      />
    )
  }
}
