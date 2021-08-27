import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Icon, Loading } from '@kube-design/components'
import { Card } from 'components/Base'
import { trigger } from 'utils/action'

import Item from './Item'

import styles from './index.scss'

@inject('rootStore')
@observer
@trigger
export default class Cates extends Component {
  store = this.props.store

  componentDidMount() {
    this.getData()
  }

  getData = () =>
    this.store.fetchList({
      noLimit: true,
      statistics: true,
    })

  isSelectedCategory = (category, id) => {
    if (id) {
      return category.category_id === id
    }

    return category.category_id === 'ctg-uncategorized'
  }

  showEdit = (data = {}) => {
    const names = this.store.list.data.map(item => item.name)
    this.trigger('openpitrix.category.edit', {
      detail: data,
      names,
      success: () => {
        this.getData()
        this.props.onSelect('')
      },
    })
  }

  showDelete = data => {
    this.trigger('openpitrix.category.delete', {
      detail: data,
      success: () => {
        this.getData()
        this.props.onSelect('')
      },
    })
  }

  render() {
    const { selectedId, onSelect } = this.props
    const { list } = this.store

    return (
      <Loading spinning={list.isLoading}>
        <Card className={styles.categories}>
          <div className={styles.title}>
            <label>
              {t('All Categories')} ({list.total})
            </label>
            <label className={styles.add}>
              <Icon onClick={this.showEdit} name={'add'} size={20} />
            </label>
          </div>
          <ul>
            {list.data.map(item => (
              <Item
                key={item.category_id}
                data={item}
                onSelect={onSelect}
                onEdit={this.showEdit}
                onDelete={this.showDelete}
                isSelected={this.isSelectedCategory(item, selectedId)}
              />
            ))}
          </ul>
        </Card>
      </Loading>
    )
  }
}
