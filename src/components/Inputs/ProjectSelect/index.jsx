import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { pick } from 'lodash'
import { Icon, Select, Tooltip } from '@kube-design/components'
import ProjectStore from 'stores/project'

import styles from './index.scss'

@observer
export default class ProjectSelect extends Component {
  projectStore = new ProjectStore()

  componentDidMount() {
    this.fetchProjects()
  }

  fetchProjects = (params = {}) => {
    const { cluster } = this.props
    return this.projectStore.fetchList({
      cluster,
      ...params,
    })
  }

  getProjects() {
    const { defaultValue } = this.props
    const { data } = this.projectStore.list

    const result = data
      .filter(item => item.status !== 'Terminating')
      .map(item => ({
        label: item.name,
        value: item.name,
        disabled: item.isFedManaged,
        isFedManaged: item.isFedManaged,
      }))

    if (defaultValue && !data.find(item => item.name === defaultValue)) {
      result.unshift({
        label: defaultValue,
        value: defaultValue,
      })
    }

    return result
  }

  optionRenderer = option => (
    <div className={styles.option}>
      {option.isFedManaged ? (
        <img className={styles.indicator} src="/assets/cluster.svg" />
      ) : (
        <Icon name="project" />
      )}
      {option.label}
      {option.isFedManaged && (
        <Tooltip
          content={this.props.tipMessage || t('FEDPROJECT_RESOURCE_TIP')}
        >
          <Icon className={styles.tip} name="question" />
        </Tooltip>
      )}
    </div>
  )

  render() {
    const { cluster, ...rest } = this.props

    if (!rest.value && rest.defaultValue) {
      rest.value = rest.defaultValue
    }

    return (
      <Select
        options={this.getProjects()}
        pagination={pick(this.projectStore.list, ['page', 'limit', 'total'])}
        isLoading={this.projectStore.list.isLoading}
        valueRenderer={this.optionRenderer}
        optionRenderer={this.optionRenderer}
        onFetch={this.fetchProjects}
        searchable
        clearable
        {...rest}
      />
    )
  }
}
