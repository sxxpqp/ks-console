import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { isEmpty } from 'lodash'

import { Loading } from '@kube-design/components'

import { getDisplayName, getLocalTime } from 'utils'
import { trigger } from 'utils/action'

import ServiceAccountStore from 'stores/serviceAccount'

import DetailPage from 'projects/containers/Base/Detail'

import getRoutes from './routes'

@inject('rootStore')
@observer
@trigger
export default class ServiceAccountDetail extends React.Component {
  store = new ServiceAccountStore()

  componentDidMount() {
    this.fetchData()
  }

  get module() {
    return 'serviceaccounts'
  }

  get name() {
    return 'ServiceAccount'
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get listUrl() {
    const { isFedManaged } = toJS(this.store.detail)

    const { workspace, cluster, namespace } = this.props.match.params
    if (workspace) {
      if (isFedManaged) {
        return `/${workspace}/federatedprojects/${namespace}/${this.module}`
      }

      return `/${workspace}/clusters/${cluster}/projects/${namespace}/${this.module}`
    }
    return `/clusters/${cluster}/${this.module}`
  }

  get isFedManaged() {
    return this.store.detail.isFedManaged
  }

  fetchData = () => {
    this.store.fetchDetail(this.props.match.params)
  }

  getOperations = () => [
    {
      key: 'edit',
      icon: 'pen',
      text: t('Edit Info'),
      action: 'edit',
      onClick: () =>
        this.trigger('serviceaccount.edit', {
          type: t(this.name),
          detail: toJS(this.store.detail),
          success: this.fetchData,
          ...this.props.match.params,
        }),
    },
    {
      key: 'editYaml',
      icon: 'pen',
      text: t('Edit YAML'),
      action: 'edit',
      onClick: () =>
        this.trigger('resource.yaml.edit', {
          detail: this.store.detail,
          success: this.fetchData,
        }),
    },
    {
      key: 'modifyServiceAccountRole',
      icon: 'pen',
      text: t('Modify Service Account Role'),
      action: 'edit',
      onClick: () =>
        this.trigger('serviceaccount.role.edit', {
          detail: this.store.detail,
          success: this.fetchData,
          ...this.props.match.params,
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
    const detail = toJS(this.store.detail)
    const { cluster, namespace } = this.props.match.params

    if (isEmpty(detail)) {
      return
    }

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
        name: t('Role'),
        value: detail.role,
      },
      {
        name: t('Created Time'),
        value: getLocalTime(detail.createTime).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        name: t('Creator'),
        value: detail.creator,
      },
    ]
  }

  render() {
    const stores = { detailStore: this.store }

    if (this.store.isLoading) {
      return <Loading className="ks-page-loading" />
    }

    const sideProps = {
      module: this.module,
      name: getDisplayName(this.store.detail),
      desc: this.store.detail.description,
      operations: this.isFedManaged ? [] : this.getOperations(),
      attrs: this.getAttrs(),
      breadcrumbs: [
        {
          label: t('ServiceAccounts'),
          url: this.listUrl,
        },
      ],
    }

    return (
      <DetailPage
        stores={stores}
        {...sideProps}
        routes={getRoutes(this.props.match.path)}
      />
    )
  }
}
