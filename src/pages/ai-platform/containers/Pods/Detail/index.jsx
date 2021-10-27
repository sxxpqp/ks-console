import React from 'react'
import { get, isEmpty } from 'lodash'
import { observer, inject } from 'mobx-react'
import { Loading } from '@kube-design/components'

import { getDisplayName, getLocalTime } from 'utils'
import { trigger } from 'utils/action'
import PodStore from 'stores/pod'

import DetailPage from 'projects/containers/Base/Detail'

import getRoutes from './routes'

@inject('rootStore')
@observer
@trigger
export default class PodDetail extends React.Component {
  store = new PodStore()

  componentDidMount() {
    this.fetchData()
  }

  get module() {
    return 'pods'
  }

  get name() {
    return 'Pod'
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get listUrl() {
    const { workspace, cluster, namespace } = this.props.match.params

    const referrer = localStorage.getItem('pod-detail-referrer')

    if (referrer) {
      return referrer
    }

    if (workspace) {
      return `/${workspace}/clusters/${cluster}/projects/${namespace}/${this.module}`
    }
    return `/clusters/${cluster}/${this.module}`
  }

  fetchData = () => {
    const { cluster, namespace, podName } = this.props.match.params
    this.store.fetchDetail({
      cluster,
      namespace,
      name: podName,
    })
  }

  getOperations = () => [
    {
      key: 'viewYaml',
      icon: 'eye',
      text: t('View YAML'),
      action: 'view',
      onClick: () =>
        this.trigger('resource.yaml.edit', {
          detail: this.store.detail,
          readOnly: true,
        }),
    },
    {
      key: 'delete',
      icon: 'trash',
      text: t('Delete'),
      action: 'delete',
      type: 'danger',
      onClick: () =>
        this.trigger('resource.delete', {
          type: t(this.name),
          detail: this.store.detail,
          success: () => this.routing.push(this.listUrl),
        }),
    },
  ]

  getAttrs = () => {
    const { cluster, namespace } = this.props.match.params

    const { detail = {} } = this.store

    if (isEmpty(detail)) return null

    const { status, restarts } = detail.podStatus

    return [
      {
        name: t('Cluster'),
        value: cluster,
      },
      {
        name: t('Project'),
        value: namespace,
      },
      {
        name: t('Application'),
        value: detail.app,
      },
      {
        name: t('Status'),
        value: t(status),
      },
      {
        name: t('Pod IP'),
        value: detail.podIp,
      },
      {
        name: t('Node Name'),
        value: detail.node,
      },
      {
        name: t('Node IP'),
        value: detail.nodeIp,
      },
      {
        name: `${t('Restart Count')}(${t('Total')})`,
        value: restarts,
      },
      {
        name: t('QoS Class'),
        value: get(detail, 'status.qosClass'),
      },
      {
        name: t('Created Time'),
        value: getLocalTime(detail.createTime).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]
  }

  render() {
    const stores = { detailStore: this.store }

    if (this.store.isLoading && !this.store.detail.name) {
      return <Loading className="ks-page-loading" />
    }

    const sideProps = {
      module: this.module,
      name: getDisplayName(this.store.detail),
      desc: this.store.detail.description,
      operations: this.getOperations(),
      attrs: this.getAttrs(),
      breadcrumbs: [
        {
          label: t('Pods'),
          url: this.listUrl,
        },
      ],
    }

    return (
      <DetailPage
        noBread
        stores={stores}
        {...sideProps}
        routes={getRoutes(this.props.match.path)}
        // 透传
        {...this.props}
      />
    )
  }
}
