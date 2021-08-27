import React from 'react'
import { observer, inject } from 'mobx-react'
import { isEmpty } from 'lodash'
import { RadioGroup, RadioButton, Tag, Loading } from '@kube-design/components'
import Banner from 'components/Cards/Banner'
import { parse } from 'qs'

import ComponentStore from 'stores/component'

import Card from './Card'

import styles from './index.scss'

@inject('rootStore')
@observer
export default class ServiceComponents extends React.Component {
  constructor(props) {
    super(props)

    const { type } = parse(location.search.slice(1)) || {}

    this.state = {
      type: type || 'kubesphere',
    }

    this.configs = this.getConfigs()
    this.store = new ComponentStore()
    this.store.fetchList({ cluster: this.cluster })
  }

  get prefix() {
    return this.props.match.url
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  getColor = healthy => (healthy ? '#f5a623' : '#55bc8a')

  getCount = type => {
    const exceptionCount = this.store.exceptionCount
    const healthyCount = this.store.healthyCount

    return exceptionCount[type] || healthyCount[type] || 0
  }

  getConfigs = () => [
    {
      type: 'kubesphere',
      title: 'KubeSphere',
      icon: '/assets/kubesphere.svg',
    },
    {
      type: 'kubernetes',
      title: 'Kubernetes',
      icon: '/assets/kubernetes.svg',
    },
    {
      type: 'istio',
      title: 'Istio',
      icon: '/assets/istio.svg',
      disabled: !globals.app.hasClusterModule(this.cluster, 'servicemesh'),
    },
    {
      type: 'monitoring',
      title: 'Monitoring',
      icon: '/assets/monitoring.svg',
      disabled: !globals.app.hasClusterModule(this.cluster, 'monitoring'),
    },
    {
      type: 'logging',
      title: 'Logging',
      icon: '/assets/logging.svg',
      disabled: !globals.app.hasClusterModule(this.cluster, 'logging'),
    },
    {
      type: 'devops',
      title: 'DevOps',
      icon: '/assets/dev-ops.svg',
      disabled: !globals.app.hasClusterModule(this.cluster, 'devops'),
    },
  ]

  handleTypeChange = type => {
    this.setState({ type })
  }

  renderHeader() {
    return (
      <Banner
        icon="components"
        title={t('Service Components')}
        description={t('SERVICE_COMPONENTS_DESC')}
        extra={<div className={styles.toolbar}>{this.renderBar()}</div>}
      />
    )
  }

  renderBar() {
    const exceptionCount = this.store.exceptionCount

    return (
      <div className="inline-block">
        <RadioGroup
          mode="button"
          value={this.state.type}
          onChange={this.handleTypeChange}
        >
          {this.configs
            .filter(item => !item.disabled)
            .map(({ type, title }) => (
              <RadioButton key={type} value={type}>
                {title}
                <Tag color={this.getColor(exceptionCount[type])}>
                  {this.getCount(type)}
                </Tag>
              </RadioButton>
            ))}
        </RadioGroup>
      </div>
    )
  }

  renderCards(data) {
    return (
      <div className={styles.cards}>
        {data.map(item => (
          <Card key={item.name} component={item} cluster={this.cluster} />
        ))}
      </div>
    )
  }

  renderComponents(type) {
    const { data } = this.store.list
    const config = this.configs.find(item => item.type === type) || {}
    const components = data[type]

    if (isEmpty(components)) {
      return null
    }

    return (
      <div className={styles.cardsWrapper}>
        <div className={styles.cardTitle}>
          <img src={config.icon} alt={config.title} />
        </div>
        {this.renderCards(components)}
      </div>
    )
  }

  renderList() {
    const { isLoading } = this.store.list
    const { type } = this.state

    if (isLoading) {
      return (
        <div className="loading">
          <Loading />
        </div>
      )
    }

    return this.renderComponents(type)
  }

  render() {
    return (
      <div className={styles.wrapper}>
        {this.renderHeader()}
        {this.renderList()}
      </div>
    )
  }
}
