import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { parse } from 'qs'
import { omit } from 'lodash'
import { Icon } from '@kube-design/components'
import { formatSize } from 'utils'

import Table from 'components/Tables/List'
import EmptyCard from 'devops/components/Cards/EmptyCard'

@inject('rootStore', 'detailStore')
@observer
export default class Artifacts extends React.Component {
  name = 'Artifacts'

  store = this.props.detailStore || {}

  get routing() {
    return this.props.rootStore.routing
  }

  get prefix() {
    return this.props.match.url
  }

  componentDidMount() {
    const { params } = this.props.match

    this.unsubscribe = this.routing.history.subscribe(location => {
      if (location.pathname === this.props.match.url) {
        const query = parse(location.search.slice(1))
        this.getData({ ...params, ...query })
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  getData(params) {
    this.store.getArtifacts({
      ...params,
    })
  }

  handleFetch = (params, refresh) => {
    this.routing.query(params, refresh)
  }

  getDownloadUrl = url => {
    const { params } = this.props.match

    return params.cluster === 'default' || !params.cluster
      ? `/kapis/devops.kubesphere.io/v1alpha2/devops/${params.devops}/jenkins${url}`
      : `/kapis/clusters/${params.cluster}/devops.kubesphere.io/v1alpha2/devops/${params.devops}/jenkins${url}`
  }

  getFilteredValue = dataIndex => this.store.list.filters[dataIndex]

  getColumns = () => [
    {
      title: t('Name'),
      dataIndex: 'path',
      width: '40%',
      render: (path, record) => (
        <a
          href={this.getDownloadUrl(record.url)}
          target="_blank"
          download={true}
          rel="noreferrer noopener"
        >
          {path}
        </a>
      ),
    },
    {
      title: t('Size'),
      dataIndex: 'size',
      width: '40%',
      render: size => formatSize(size),
    },
    {
      title: t('Download'),
      width: '20%',
      key: 'download',
      render: record => (
        <a
          href={this.getDownloadUrl(record.url)}
          target="_blank"
          download={true}
          rel="noreferrer noopener"
        >
          <Icon name="download" />
        </a>
      ),
    },
  ]

  render() {
    const { data, filters, isLoading, total, page, limit } = toJS(
      this.store.artifactsList
    )
    const isEmptyList = total === 0
    const omitFilters = omit(filters, 'page', 'workspace')

    if (isEmptyList && !filters.page) {
      return <EmptyCard desc={t('No artifacts records')} />
    }

    const pagination = { total, page, limit }

    return (
      <Table
        data={data}
        columns={this.getColumns()}
        filters={omitFilters}
        rowKey={'path'}
        pagination={pagination}
        isLoading={isLoading}
        onFetch={this.handleFetch}
        hideSearch
      />
    )
  }
}
