import React from 'react'
import { get } from 'lodash'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { Button, InputSearch, Columns, Column } from '@kube-design/components'
import { Modal, ScrollLoad } from 'components/Base'
import ClusterStore from 'stores/cluster'
import Card from './Card'

import styles from './index.scss'

@observer
export default class ClusterSelectModal extends React.Component {
  constructor(props) {
    super(props)
    this.store = new ClusterStore()
  }

  fetchData = params => {
    this.store.fetchList({ ...params })
  }

  handleSearch = name => {
    this.fetchData({ name })
  }

  handleRefresh = () => {
    this.fetchData()
  }

  handleOnEnter = cluster => {
    const { onChange } = this.props
    localStorage.setItem(`${globals.user.username}-cluster`, cluster)
    onChange && onChange(cluster)
  }

  render() {
    const { visible, onCancel } = this.props
    const { data, total, page, isLoading } = this.store.list

    const keyword = get(this.store.list, 'filters.name')

    return (
      <Modal
        bodyClassName={styles.body}
        visible={visible}
        onCancel={onCancel}
        width={960}
        icon="cluster"
        title={t('Cluster Management')}
        description={t('CLUSTERS_MANAGE_DESC')}
        hideFooter
      >
        <div className={styles.bar}>
          <Columns>
            <Column>
              <InputSearch
                value={keyword}
                placeholder={t('Search by name')}
                onSearch={this.handleSearch}
              />
            </Column>
            <Column className="is-narrow">
              <Button icon="refresh" type="flat" onClick={this.handleRefresh} />
            </Column>
          </Columns>
        </div>
        <div className={styles.list}>
          <ScrollLoad
            wrapperClassName={styles.listWrapper}
            data={toJS(data)}
            total={total}
            page={page}
            loading={isLoading}
            onFetch={this.fetchData}
          >
            {data.map(item => (
              <Card key={item.uid} data={item} onEnter={this.handleOnEnter} />
            ))}
          </ScrollLoad>
        </div>
      </Modal>
    )
  }
}
