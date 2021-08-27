import React from 'react'
import { observer, inject } from 'mobx-react'
import { get } from 'lodash'

import { Panel } from 'components/Base'
import Attributes from 'core/containers/Base/Detail/BaseInfo/Attributes'

import styles from './index.scss'

@inject('detailStore')
@observer
export default class Configuration extends React.Component {
  render() {
    const detail = get(this.props.detailStore, 'detail', {})
    const { address, config = {}, type } = detail

    return (
      <Panel>
        <Attributes className={styles.attributes}>
          {type === 'kafka' && (
            <Attributes.Item
              className={styles.item}
              name={t('topic')}
              value={config.topics}
            />
          )}
          <Attributes.Item
            className={styles.item}
            name={t('Address')}
            value={address}
          />
          {type === 'es' && (
            <Attributes.Item
              className={styles.item}
              name={t('Index Prefix')}
              value={config.logstashPrefix}
            />
          )}
        </Attributes>
      </Panel>
    )
  }
}
