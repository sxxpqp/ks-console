import React, { Component } from 'react'

import Access from './Access'

import styles from './index.scss'

export default class InternetAccess extends Component {
  render() {
    const { clusters, actions } = this.props
    return (
      <div>
        <div className={styles.title}>{t('Internet Access')}</div>
        {clusters.map(cluster => (
          <Access
            key={cluster.name}
            cluster={cluster}
            {...this.props.match.params}
            actions={actions}
          />
        ))}
      </div>
    )
  }
}
