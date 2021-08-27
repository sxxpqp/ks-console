import { isEmpty } from 'lodash'
import React from 'react'
import { observer, inject } from 'mobx-react'
import {
  Button,
  Loading,
  Pagination,
  InputSearch,
} from '@kube-design/components'
import Banner from 'components/Cards/Banner'
import EmptyList from 'components/Cards/EmptyList'
import ClusterCard from 'clusters/components/Cards/Cluster'
import ClusterStore from 'stores/cluster'
import { trigger } from 'utils/action'

import styles from './index.scss'

@inject('rootStore')
@observer
@trigger
class Clusters extends React.Component {
  constructor(props) {
    super(props)

    this.store = new ClusterStore()
    this.hostStore = new ClusterStore()
  }

  componentDidMount() {
    this.fetchHostData()
    this.fetchData()
  }

  get authKey() {
    return 'clusters'
  }

  get enabledActions() {
    return globals.app.getActions({
      module: this.authKey,
    })
  }

  get routing() {
    return this.props.rootStore.routing
  }

  fetchData = (params = {}) => {
    this.store.fetchList({
      ...params,
      limit: 10,
      labelSelector: '!cluster-role.kubesphere.io/host',
    })
  }

  fetchHostData = (params = {}) => {
    this.hostStore.fetchList({
      ...params,
      labelSelector: 'cluster-role.kubesphere.io/host=',
      limit: -1,
    })
  }

  showAddCluster = () => {
    this.trigger('cluster.add', {
      module: 'clusters',
      success: this.routing.push,
    })
  }

  handlePagination = page => {
    this.fetchData({ page })
  }

  handleRefresh = () => {
    this.fetchData({ page: 1 })
  }

  handleSearch = name => {
    this.fetchData({ name })
    this.fetchHostData({ name })
  }

  enterCluster = async cluster => {
    this.routing.push(`/clusters/${cluster}/overview`)
  }

  renderList() {
    const { data, page, total, limit, filters, isLoading } = this.store.list
    const {
      data: hostClusters,
      isLoading: isHostLoading,
      filters: hostFilters,
    } = this.hostStore.list

    if (
      isEmpty(data) &&
      !isLoading &&
      isEmpty(filters) &&
      !isHostLoading &&
      isEmpty(hostFilters) &&
      isEmpty(hostClusters)
    ) {
      return (
        <EmptyList
          icon="cluster"
          title={t('NO_CLUSTER_TIP')}
          desc={t('NO_CLUSTER_TIP_DESC')}
          actions={
            this.enabledActions.includes('create') ? (
              <Button type="control" onClick={this.showAddCluster}>
                {t('Add Cluster')}
              </Button>
            ) : null
          }
        />
      )
    }

    if (isLoading || isHostLoading) {
      return <Loading className={styles.loading} />
    }

    if (
      !isLoading &&
      isEmpty(data) &&
      !isHostLoading &&
      isEmpty(hostClusters)
    ) {
      return (
        <>
          <div className="h6 margin-b12">
            {t('Cluster List')} <span className={styles.total}>{total}</span>
          </div>
          <div className={styles.noData}>
            <img src="/assets/empty-card.svg" alt="" />
            <p>{t('RESOURCE_NOT_FOUND')}</p>
          </div>
        </>
      )
    }

    return (
      <ul className={styles.cards}>
        {!isEmpty(hostClusters) && (
          <div className="margin-b12">
            <div className="h6">
              {hostClusters.length > 1 ? t('Host Clusters') : t('Host Cluster')}
            </div>
            {hostClusters.map(item => (
              <ClusterCard
                key={item.name}
                data={item}
                onEnter={this.enterCluster}
              />
            ))}
          </div>
        )}
        {!isEmpty(data) && (
          <div>
            <div className="h6">
              {t('Member Clusters')}{' '}
              <span className={styles.total}>{total}</span>
            </div>
            {data.map(item => (
              <ClusterCard
                key={item.name}
                data={item}
                onEnter={this.enterCluster}
              />
            ))}
            <div className="text-right margin-t12">
              <Pagination
                page={page}
                total={total}
                limit={limit}
                onChange={this.handlePagination}
              />
            </div>
          </div>
        )}
      </ul>
    )
  }

  renderSearch() {
    return (
      <div className={styles.searchPanel}>
        <InputSearch
          className={styles.search}
          onSearch={this.handleSearch}
          placeholder={t('Search by name')}
        />
        <Button
          type="flat"
          icon="refresh"
          onClick={this.handleRefresh}
          data-test="cluster-refresh"
        />
        {this.enabledActions.includes('create') && (
          <Button
            type="control"
            onClick={this.showAddCluster}
            data-test="cluster-create"
          >
            {t('Add Cluster')}
          </Button>
        )}
      </div>
    )
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <Banner
          className={styles.banner}
          icon="cluster"
          title={t('Clusters Management')}
          description={t('CLUSTERS_MANAGE_DESC')}
          extra={this.renderSearch()}
        />
        {this.renderList()}
      </div>
    )
  }
}

export default Clusters
