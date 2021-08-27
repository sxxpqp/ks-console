import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { get, isEmpty } from 'lodash'
import { Loading } from '@kube-design/components'

import { getDisplayName, getLocalTime } from 'utils'
import { trigger } from 'utils/action'
import AppStore from 'stores/application/crd'
import FederatedStore from 'stores/federated'

import DetailPage from 'projects/containers/Base/Detail'

import routes from './routes'

@inject('rootStore', 'projectStore')
@observer
@trigger
export default class AppDetail extends React.Component {
  store = new FederatedStore(new AppStore())

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
    const { workspace, namespace } = this.props.match.params

    return `/${workspace}/federatedprojects/${namespace}/${this.module}`
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
      text: t('Add Component'),
      action: 'edit',
      onClick: () =>
        this.trigger('crd.app.addservice', {
          isFederated: true,
          detail: toJS(this.store.detail),
          projectDetail: this.props.projectStore.detail,
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
    const { namespace } = this.props.match.params

    if (isEmpty(detail)) {
      return
    }

    const appName = get(detail, 'labels["app.kubernetes.io/name"]')

    return [
      {
        name: t('Project'),
        value: namespace,
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
    const stores = { detailStore: this.store, fedDetailStore: this.fedStore }

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

    return <DetailPage stores={stores} {...sideProps} routes={routes} />
  }
}
