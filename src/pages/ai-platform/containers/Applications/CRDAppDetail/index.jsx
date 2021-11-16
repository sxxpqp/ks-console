import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { get, isEmpty } from 'lodash'
import { Loading } from '@kube-design/components'

import { getDisplayName, getLocalTime } from 'utils'
import { trigger } from 'utils/action'

import AppStore from 'stores/application/crd'
import { Status } from 'components/Base'
import DetailPage from 'projects/containers/Base/Detail'

import routes from './routes'

@inject('rootStore')
@observer
@trigger
export default class CRDAppDetail extends React.Component {
  store = new AppStore()

  componentDidMount() {
    this.fetchData()
  }

  get module() {
    return 'applications'
  }

  get name() {
    return 'Application'
  }

  get listUrl() {
    const { workspace, cluster, namespace } = this.props.match.params

    return `/${workspace}/clusters/${cluster}/projects/${namespace}/${this.module}/composing`
    // return `/${workspace}/clusters/${cluster}/projects/${namespace}/${this.module}/composing`
  }

  get routing() {
    return this.props.rootStore.routing
  }

  fetchData = () => {
    const { params } = this.props.match
    this.store.fetchDetail(params)
  }

  getOperations = () => [
    {
      key: 'edit',
      icon: 'pen',
      text: t('Edit Info'),
      action: 'edit',
      onClick: () =>
        this.trigger('resource.baseinfo.edit', {
          type: t(this.name),
          detail: toJS(this.store.detail),
          success: this.fetchData,
        }),
    },
    {
      key: 'addComponent',
      icon: 'add',
      text: t('Add Service'),
      action: 'edit',
      onClick: () =>
        this.trigger('crd.app.addservice', {
          success: this.fetchComponents,
          detail: toJS(this.store.detail),
          ...this.props.match.params,
        }),
    },
    {
      key: 'addRoute',
      icon: 'add',
      text: t('Add Route'),
      action: 'edit',
      onClick: () =>
        this.trigger('crd.app.addroute', {
          success: this.fetchData,
          detail: toJS(this.store.detail),
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

    const appName = get(detail, 'labels["app.kubernetes.io/name"]')

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
        name: t('Status'),
        value: <Status name={t(detail.status)} type={detail.status} />,
      },
      {
        name: t('Application'),
        value: appName,
      },
      {
        name: t('Version'),
        value: detail.version,
      },
      {
        name: t('Created Time'),
        value: getLocalTime(detail.createTime).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        name: t('Updated Time'),
        value: getLocalTime(detail.updateTime).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        name: t('Creator'),
        value: detail.creator,
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
          label: t('Applications'),
          url: this.listUrl,
        },
      ],
    }

    return <DetailPage noBread stores={stores} {...sideProps} routes={routes} />
  }
}
