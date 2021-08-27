import React from 'react'
import { observer, inject } from 'mobx-react'
import { isEmpty } from 'lodash'
import { parse } from 'qs'

import BaseTable from 'components/Tables/Base'
import withTableActions from 'components/HOCs/withTableActions'
import ProjectSelect from './ProjectSelect'

class ResourceTable extends React.Component {
  routing = this.props.rootStore.routing

  componentDidMount() {
    const params = parse(location.search.slice(1))
    if (
      params.namespace &&
      this.props.clusterStore.project !== params.namespace
    ) {
      this.props.clusterStore.setProject(params.namespace)
    }
  }

  get showEmpty() {
    const { data, isLoading, filters, clusterStore } = this.props
    return (
      isEmpty(data) && !isLoading && isEmpty(filters) && !clusterStore.project
    )
  }

  fetchProjects = (params = {}) => {
    const { cluster, clusterStore } = this.props
    return clusterStore.fetchProjects({
      cluster,
      ...clusterStore.projects.filters,
      ...params,
    })
  }

  handleClusterChange = project => {
    this.props.clusterStore.setProject(project)
    this.props.onFetch({}, true)
  }

  renderCustomFilter() {
    const { module, cluster, clusterStore } = this.props
    return (
      <ProjectSelect
        module={module}
        cluster={cluster}
        list={clusterStore.projects}
        namespace={clusterStore.project}
        onFetch={this.fetchProjects}
        onChange={this.handleClusterChange}
      />
    )
  }

  render() {
    return (
      <BaseTable
        customFilter={this.renderCustomFilter()}
        showEmpty={this.showEmpty}
        {...this.props}
      />
    )
  }
}

export default inject(
  'rootStore',
  'clusterStore'
)(observer(withTableActions(ResourceTable)))
