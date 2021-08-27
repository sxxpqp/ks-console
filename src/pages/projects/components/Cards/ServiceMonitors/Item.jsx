import React from 'react'
import PropTypes from 'prop-types'

import { Text } from 'components/Base'

import styles from './index.scss'

export default class Item extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
  }

  static defaultProps = {
    detail: {},
  }

  render() {
    const { detail } = this.props

    if (!detail) {
      return null
    }

    return (
      <div className={styles.item}>
        <Text
          icon="monitor"
          title={detail.name}
          description={t('Monitoring Exporter')}
        />

        <Text title={detail.port} description={t('Port')} />
        <Text title={detail.path} description={t('Path')} />
        <Text title={detail.interval} description={t('Scrap Interval(min)')} />
        <Text title={detail.scrapeTimeout} description={t('Timeout(s)')} />
      </div>
    )
  }
}
