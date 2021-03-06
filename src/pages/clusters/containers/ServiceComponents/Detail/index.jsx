import React from 'react'
import { observer, inject } from 'mobx-react'
import { Loading } from '@kube-design/components'

import { getLocalTime, getDisplayName } from 'utils'
import { getComponentStatus } from 'utils/status'
import ComponentStore from 'stores/component'
import { Status } from 'components/Base'
import DetailPage from 'clusters/containers/Base/Detail'

import routes from './routes'

@inject('rootStore')
@observer
export default class ComponentDetail extends React.Component {
  store = new ComponentStore()

  get name() {
    return 'Service Component'
  }

  get module() {
    return 'components'
  }

  get listUrl() {
    const { cluster } = this.props.match.params
    return `/clusters/${cluster}/components`
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    this.store.fetchDetail(this.props.match.params)
  }

  getOperations = () => []

  getAttrs = () => {
    const { detail } = this.store

    const status = getComponentStatus(detail)

    return [
      {
        name: t('Status'),
        value: <Status type={status} name={t(status)} />,
      },
      {
        name: t('Cluster'),
        value: this.props.match.params.cluster,
      },
      {
        name: t('Project'),
        value: detail.namespace,
      },
      {
        name: t('Instance Count'),
        value: `${detail.healthyBackends} / ${detail.totalBackends}`,
      },
      {
        name: t('Created Time'),
        value: getLocalTime(detail.startedAt).format('YYYY-MM-DD HH:mm:ss'),
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
          label: t('Components'),
          url: this.listUrl,
        },
      ],
    }

    return <DetailPage stores={stores} routes={routes} {...sideProps} />
  }
}
