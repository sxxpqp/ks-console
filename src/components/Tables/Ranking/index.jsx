import React from 'react'
import { observer, inject } from 'mobx-react'
import { Table } from '@kube-design/components'
import classNames from 'classnames'
import { get } from 'lodash'

import styles from './index.scss'

export const THEME = {
  default: classNames(styles.table, styles.table_rank, styles.table_no_border),
  transparent: classNames(
    styles.table,
    styles.table_rank,
    styles.table_no_border,
    styles.table_transparent
  ),
}

@inject('rootStore')
@observer
export default class RankingTable extends React.Component {
  get columns() {
    const sort_metric = get(this, 'props.store.sort_metric', '')
    return this.props.columns.map(column => ({
      ...column,
      className: column.sort_metric === sort_metric ? styles.rankCol : '',
    }))
  }

  render() {
    const { theme, ...tableProps } = this.props

    return (
      <div className={theme || THEME.default} data-test="ranking">
        <Table {...tableProps} columns={this.columns} />
      </div>
    )
  }
}
