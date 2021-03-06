import React from 'react'
import { omit } from 'lodash'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { parse } from 'qs'
import { getLocalTime } from 'utils'

import Table from 'components/Tables/List'
import EmptyCard from 'devops/components/Cards/EmptyCard'

@inject('rootStore', 'detailStore')
@observer
export default class Branch extends React.Component {
  store = this.props.detailStore || {}

  name = 'Commit'

  get routing() {
    return this.props.rootStore.routing
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
    this.store.getCommits({
      ...params,
    })
  }

  handleFetch = (params, refresh) => {
    this.routing.query(params, refresh)
  }

  getFilteredValue = dataIndex => this.store.list.filters[dataIndex]

  getColumns = () => [
    {
      title: t('commit'),
      dataIndex: 'commitId',
      width: '20%',
      render: (commitId, record) => {
        return (
          <a href={record.url} target="_blank" rel="noreferrer noopener">
            {commitId && commitId.slice(0, 6)}
          </a>
        )
      },
    },
    {
      title: t('Author'),
      dataIndex: 'author',
      width: '20%',
      render: author => author || '-',
    },
    {
      title: t('message'),
      dataIndex: 'title',
      width: '40%',
    },
    {
      title: t('Updated Time'),
      dataIndex: 'startTime',
      isHideable: true,
      width: '15%',
      render: startTime =>
        getLocalTime(startTime).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  render() {
    const {
      data,
      filters,
      selectedRowKeys,
      isLoading,
      total,
      page,
      limit,
    } = toJS(this.store.commitsList)

    const isEmptyList = isLoading === false && total === 0

    const omitFilters = omit(filters, 'page')

    if (isEmptyList && !filters.page) {
      return <EmptyCard desc={t('No commit records')} />
    }

    const pagination = { total, page, limit }

    return (
      <Table
        data={data}
        rowKey="commitId"
        columns={this.getColumns()}
        filters={omitFilters}
        pagination={pagination}
        isLoading={isLoading}
        selectedRowKeys={selectedRowKeys}
        onFetch={this.handleFetch}
        hideSearch
      />
    )
  }
}
