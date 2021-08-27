import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { isEmpty, get } from 'lodash'

import EnvStore from 'stores/workload/env'

import ContainerEnvCard from 'components/Cards/Containers/EnvVariables'

class EnvVariables extends React.Component {
  constructor(props) {
    super(props)

    this.envStore = new EnvStore()
    this.fetchData()
  }

  get module() {
    return this.store.module
  }

  get store() {
    return this.props.detailStore
  }

  get namespace() {
    return this.store.detail.namespace
  }

  get cluster() {
    return this.store.detail.cluster
  }

  get containers() {
    const data = toJS(this.store.detail)
    const { spec, containers = [] } = data

    if (this.module === 'containers') return [data]

    if (!isEmpty(containers)) return containers
    if (!isEmpty(spec)) return get(spec, 'template.spec.containers', [])

    return []
  }

  get initContainers() {
    const data = toJS(this.store.detail)
    const { spec, initContainers = [] } = data

    if (this.module === 'containers') return [data]

    if (!isEmpty(initContainers)) return initContainers
    if (!isEmpty(spec)) return get(spec, 'template.spec.initContainers', [])

    return []
  }

  fetchData = () => {
    this.envStore.fetchList({
      namespace: this.namespace,
      cluster: this.cluster,
      containers: this.containers,
      initContainers: this.initContainers,
    })
  }

  render() {
    const { data, isLoading } = toJS(this.envStore.list)

    return (
      <div>
        {data.map((container, index) => (
          <ContainerEnvCard
            key={index}
            detail={container}
            expand={index === 0}
            loading={isLoading}
          />
        ))}
      </div>
    )
  }
}

export default inject('rootStore', 'detailStore')(observer(EnvVariables))
export const Component = EnvVariables
