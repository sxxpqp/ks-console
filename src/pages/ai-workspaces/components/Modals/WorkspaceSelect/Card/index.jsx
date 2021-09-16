import { isEmpty } from 'lodash'
import React from 'react'
import { List } from 'components/Base'
import ClusterWrapper from 'components/Clusters/ClusterWrapper'
import { getLocalTime } from 'utils'

import styles from './index.scss'

export default class WorkspaceCard extends React.Component {
  handleClick = () => {
    const { data, onEnter } = this.props
    onEnter && onEnter(data.name)
  }

  render() {
    const { data, clustersDetail } = this.props

    const details = [
      {
        title: isEmpty(data.clusters) ? (
          '-'
        ) : (
          <ClusterWrapper
            clusters={data.clusters}
            clustersDetail={clustersDetail}
          />
        ),
        className: styles.clusters,
        description: t('Cluster Info'),
      },
      {
        title: data.createTime
          ? getLocalTime(data.createTime).format(`YYYY-MM-DD HH:mm:ss`)
          : '-',
        description: t('Created Time'),
      },
    ]

    return (
      <List.Item
        icon="enterprise"
        className={styles.wrapper}
        titleClass={styles.title}
        title={<a>{data.name}</a>}
        description={data.description || '-'}
        details={details}
        onClick={this.handleClick}
      />
    )
  }
}
