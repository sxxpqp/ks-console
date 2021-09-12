import React from 'react'
import { List } from 'components/Base'
import { getLocalTime } from 'utils'
import ClusterTitle from 'components/Clusters/ClusterTitle'

import styles from './index.scss'

export default class ClusterCard extends React.Component {
  handleClick = () => {
    const { data, onEnter } = this.props
    onEnter && onEnter(data.name)
  }

  render() {
    const { data } = this.props

    const details = [
      {
        title: data.nodeCount,
        description: t('Node Count'),
      },
      {
        title: data.kubernetesVersion,
        description: t('kubernetes Version'),
      },
      {
        title: data.provider,
        description: t('Provider'),
        className: styles.provider,
      },
      {
        title: data.createTime
          ? getLocalTime(data.createTime).format(`YYYY-MM-DD HH:mm:ss`)
          : '-',
        description: t('Created Time'),
      },
    ]

    const title = <ClusterTitle cluster={data} />

    return (
      <List.Item
        className={styles.wrapper}
        titleClass={styles.title}
        title={title}
        details={details}
        onClick={this.handleClick}
      />
    )
  }
}
