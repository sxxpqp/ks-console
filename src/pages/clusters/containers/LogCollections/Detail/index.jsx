import React from 'react'
import { trigger } from 'utils/action'
import { get } from 'lodash'
import { observer, inject } from 'mobx-react'
import OutputStore from 'stores/logging/collection/output'
import DetailPage from 'clusters/containers/Base/Detail'
import { Loading } from '@kube-design/components'
import collectionConfig from '../config'

import routes from './routes'

import styles from './index.scss'

@inject('rootStore')
@observer
@trigger
export default class LogCollectionDetail extends React.Component {
  store = new OutputStore()

  get listUrl() {
    const { cluster } = this.props.match.params
    return `/clusters/${cluster}/log-collections/${this.component}`
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get component() {
    return this.props.match.params.component
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    this.store.fetchDetail(this.props.match.params)
  }

  getAttrs() {
    return [
      {
        name: t('Status'),
        value: get(this.store, 'detail.enabled')
          ? t('Collecting')
          : t('Stopped'),
      },
    ]
  }

  getOperations = () => [
    {
      key: 'edit',
      type: 'control',
      text: t('Edit'),
      action: 'edit',
      onClick: () =>
        this.trigger('log.collection.edit', {
          success: this.fetchData,
        }),
    },
    {
      key: 'changeStatus',
      text: t('Change Status'),
      icon: 'pin',
      action: 'edit',
      onClick: () =>
        this.trigger('log.collection.active.switch', {
          data: {
            enabled: Number(this.store.detail.enabled),
          },
          success: this.fetchData,
        }),
    },
    {
      key: 'delete',
      text: t('Delete Log Receiver'),
      icon: 'trash',
      action: 'delete',
      type: 'danger',
      onClick: () =>
        this.trigger('resource.delete', {
          type: t(this.name),
          detail: this.store.detail,
          success: () => this.routing.push(this.listUrl),
        }),
    },
    {
      key: 'editYaml',
      text: t('Edit YAML'),
      icon: 'pen',
      action: 'edit',
      onClick: () => {
        this.trigger('resource.yaml.edit', {
          detail: this.store.detail,
          success: this.fetchData,
        })
      },
    },
  ]

  render() {
    const stores = { detailStore: this.store }
    const collection = this.store.detail
    const collectionType = get(collection, 'type', '')
    const Icon = get(collectionConfig, `${collectionType}.ICON`)
    const name = get(collectionConfig, `${collectionType}.title`, t('Loading'))
    const icon = Icon ? (
      <Icon className={styles.icon} width={32} height={32} />
    ) : (
      'Loading'
    )

    if (this.store.isLoading) {
      return <Loading className="ks-page-loading" />
    }

    const sideProps = {
      module: this.module,
      name,
      icon,
      operations: this.getOperations(),
      attrs: this.getAttrs(),
      breadcrumbs: [
        {
          label: `${t('Log Collections')}(${t(this.component)})`,
          url: this.listUrl,
        },
      ],
    }

    return <DetailPage stores={stores} routes={routes} {...sideProps} />
  }
}
