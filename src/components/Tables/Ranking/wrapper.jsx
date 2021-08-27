import React from 'react'

import {
  Loading,
  Level,
  LevelLeft,
  LevelRight,
  Pagination,
} from '@kube-design/components'
import { inject, observer } from 'mobx-react'

const TableWrapper = (Table, setting = { pagination: true }) => {
  @inject('rootStore')
  @observer
  class HOC extends React.Component {
    get store() {
      return this.props.store
    }

    render() {
      return (
        <Loading spinning={this.store.isLoading}>
          <div>
            <Table store={this.store} />
            {setting.pagination && this.renderPagination()}
          </div>
        </Loading>
      )
    }

    renderPagination() {
      const { page, total_page: total } = this.store
      const { limit } = this.store

      return (
        <div className={setting.paginationClassName}>
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
  return HOC
}

export default TableWrapper
