import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { pick } from 'lodash'
import { Icon, Select } from '@kube-design/components'

import styles from './index.scss'

@observer
export default class ProjectSelect extends Component {
  getProjects() {
    return [
      ...this.props.list.data.map(item => ({
        label: item.name,
        value: item.name,
        isFedManaged: item.isFedManaged,
      })),
    ]
  }

  optionRenderer = option => (
    <span className={styles.option}>
      {option.isFedManaged ? (
        <img className={styles.indicator} src="/assets/cluster.svg" />
      ) : (
        <Icon name="project" />
      )}
      {option.label}
    </span>
  )

  render() {
    const { namespace, list, onChange, onFetch } = this.props

    const pagination = pick(list, ['page', 'total', 'limit'])

    return (
      <Select
        className={styles.select}
        value={namespace}
        onChange={onChange}
        options={this.getProjects()}
        placeholder={t('All Projects')}
        pagination={pagination}
        isLoading={list.isLoading}
        valueRenderer={this.optionRenderer}
        optionRenderer={this.optionRenderer}
        onFetch={onFetch}
        searchable
        clearable
      />
    )
  }
}
