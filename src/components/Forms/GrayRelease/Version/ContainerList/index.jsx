import React from 'react'

import Base from 'components/Forms/Workload/ContainerSettings/ContainerList'

import Card from './Card'

import styles from './index.scss'

export default class ContainerList extends Base {
  renderEmpty() {
    return null
  }

  renderContainers() {
    const { value, disabled } = this.props
    return (
      <ul className={styles.list}>
        {value.map(item => (
          <Card
            container={item}
            key={item.name}
            onEdit={this.handleEdit}
            onDelete={this.handleDelete}
            disabled={disabled}
          />
        ))}
      </ul>
    )
  }

  renderInitContainers() {
    const {
      specTemplate: { initContainers = [] },
      disabled,
    } = this.props

    return initContainers.map(item => (
      <Card
        container={item}
        key={item.name}
        type="init"
        onEdit={this.handleEdit}
        onDelete={this.handleDelete}
        disabled={disabled}
      />
    ))
  }

  renderAdd() {
    if (this.props.disabled) {
      return null
    }

    return super.renderAdd()
  }
}
