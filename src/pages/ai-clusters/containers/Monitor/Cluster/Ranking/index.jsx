import React from 'react'
import { observer, inject } from 'mobx-react'
import classNames from 'classnames'

import Store from 'stores/rank/node'

import {
  Button,
  Pagination,
  Level,
  LevelLeft,
  LevelRight,
  Icon,
  Loading,
  Select,
} from '@kube-design/components'

import Table from 'components/Cards/RankTable/NodeTable'

import styles from './index.scss'

@inject('rootStore')
@observer
class NodeRanking extends React.Component {
  constructor(props) {
    super(props)

    this.store = new Store({ cluster: this.cluster })
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  get options() {
    return this.store.sort_metric_options.map(option => ({
      value: option,
      label: t(`Sort By ${option}`),
    }))
  }

  download = () => {
    this.store.download('node.usage.rank.json')
  }

  componentDidMount() {
    this.store.fetchAll()
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <h3 className={classNames(styles.pane, styles.title)}>
          {t('Node Usage Ranking')}
        </h3>
        {this.renderToolbar()}
        {this.renderList()}
      </div>
    )
  }

  renderToolbar() {
    return (
      <div
        className={classNames(
          styles.toolbar,
          styles.pane__toolbar,
          styles.pane
        )}
      >
        <div className={styles.toolbar_filter}>
          <Select
            value={this.store.sort_metric}
            onChange={this.store.changeSortMetric}
            options={this.options}
          />
          <span className={styles.sort_button}>
            <Icon
              name={
                this.store.sort_type === 'desc'
                  ? 'sort-descending'
                  : 'sort-ascending'
              }
              type="coloured"
              size="small"
              onClick={this.store.changeSortType}
            />
          </span>
        </div>
        <div className={styles.toolbar_buttons}>
          <Button onClick={this.download}>{t('Export')}</Button>
        </div>
      </div>
    )
  }

  renderList() {
    return (
      <Loading spinning={this.store.isLoading}>
        <div>
          <Table store={this.store} cluster={this.cluster} />
          {this.renderPagination()}
        </div>
      </Loading>
    )
  }

  renderPagination() {
    const { page, total_page: total } = this.store
    const { limit } = this.store

    return (
      <div className={classNames(styles.pane, styles.pane__pagination)}>
        <Level>
          <LevelLeft />
          <LevelRight>
            <Pagination
              page={page}
              total={total}
              limit={limit}
              onChange={this.store.changePagination}
            />
          </LevelRight>
        </Level>
      </div>
    )
  }
}

export default NodeRanking
