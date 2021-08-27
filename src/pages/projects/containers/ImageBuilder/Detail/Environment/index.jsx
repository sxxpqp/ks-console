import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { isEmpty, get } from 'lodash'

import EnvStore from 'stores/workload/env'

import ContainerEnvCard from 'components/Cards/Containers/EnvVariables'

@inject('s2iRunStore')
@observer
export default class EnvVariables extends React.Component {
  constructor(props) {
    super(props)
    this.envStore = new EnvStore()
  }

  componentDidMount() {
    this.fetchData()
  }

  get module() {
    return this.props.module
  }

  get store() {
    return this.props.s2iRunStore
  }

  get namespace() {
    return this.store.jobDetail.namespace
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  get containers() {
    const data = toJS(this.store.jobDetail)
    const { spec, containers = [] } = data

    if (this.module === 'containers') return [data]

    if (!isEmpty(containers)) return containers
    if (!isEmpty(spec)) return get(spec, 'template.spec.containers', [])

    return []
  }

  get test() {
    return '2'
  }

  fetchData = () => {
    this.envStore.fetchList({
      cluster: this.cluster,
      namespace: this.namespace,
      containers: this.containers,
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
