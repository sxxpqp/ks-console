import React from 'react'
import { set, get } from 'lodash'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { List } from 'components/Base'

import Item from './Item'
import AddNode from './AddNode'

import styles from './index.scss'

export default class NodeList extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.array,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    name: '',
    value: [],
    readOnlyList: [],
    specTemplate: {},
    onChange() {},
  }

  state = {
    showAdd: false,
    selectIndex: -1,
  }

  showAdd = () => {
    this.setState({ showAdd: true, selectIndex: -1 })
  }

  hideAdd = () => {
    this.setState({ showAdd: false, selectIndex: -1 })
  }

  showEdit = index => {
    this.setState({ showAdd: true, selectIndex: index })
  }

  handleAdd = data => {
    const { value, onChange } = this.props
    const { selectIndex } = this.state

    if (selectIndex >= 0) {
      value[selectIndex] = data
      onChange(value)
    } else {
      onChange([...value, data])
    }

    this.updateRoleGroups()
    this.hideAdd()
  }

  updateRoleGroups = () => {
    const { formTemplate } = this.props
    const hosts = get(formTemplate, 'spec.hosts', [])
    const roleGroups = {}
    hosts.forEach(host => {
      if (host.roles) {
        host.roles.forEach(role => {
          roleGroups[role] = roleGroups[role] || []
          roleGroups[role].push(host.name)
        })
      }
    })
    roleGroups.etcd = roleGroups.master
    set(formTemplate, 'spec.roleGroups', roleGroups)
  }

  handleDelete = node => {
    const { value, onChange } = this.props
    onChange(value.filter(item => item.name !== node.name))
    this.updateRoleGroups()
  }

  renderNodes() {
    const { value } = this.props

    return value.map((item, index) => (
      <Item
        node={item}
        key={item.name}
        index={index}
        onEdit={this.showEdit}
        onDelete={this.handleDelete}
      />
    ))
  }

  renderAdd() {
    return (
      <List.Add
        icon="add"
        title={t('Add Node')}
        description={t('Add node to the cluster')}
        onClick={this.showAdd}
      />
    )
  }

  renderModal() {
    const { value } = this.props
    const { showAdd, selectIndex } = this.state
    const data = selectIndex >= 0 ? value[selectIndex] : undefined
    return (
      <AddNode
        visible={showAdd}
        data={data}
        onOk={this.handleAdd}
        onCancel={this.hideAdd}
      />
    )
  }

  render() {
    const { className } = this.props

    return (
      <div className={classNames(styles.wrapper, className)}>
        {this.renderNodes()}
        {this.renderAdd()}
        {this.renderModal()}
      </div>
    )
  }
}
