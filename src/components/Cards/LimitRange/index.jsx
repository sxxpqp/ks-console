import { get } from 'lodash'
import React from 'react'
import { observer } from 'mobx-react'

import { Icon } from '@kube-design/components'
import { Panel } from 'components/Base'

import { cpuFormat, memoryFormat } from 'utils'

import ProjectStore from 'stores/project'

import styles from './index.scss'

@observer
export default class DefaultResource extends React.Component {
  store = new ProjectStore()

  componentDidUpdate(prevProps) {
    if (prevProps.namespace !== this.props.namespace && this.props.namespace) {
      this.store.fetchLimitRanges(this.props)
    }
  }

  componentDidMount() {
    if (this.props.namespace) {
      this.store.fetchLimitRanges(this.props)
    }
  }

  render() {
    const detail = get(this.store, 'limitRanges.data[0]')

    const cpuLimit = cpuFormat(get(detail, 'limit.default.cpu'))
    const cpuRequest = cpuFormat(get(detail, 'limit.defaultRequest.cpu'))
    const memoryLimit = memoryFormat(get(detail, 'limit.default.memory'))
    const memoryRequest = memoryFormat(
      get(detail, 'limit.defaultRequest.memory')
    )

    return (
      <Panel title={t('Container Resource Default Request')}>
        <div className={styles.content}>
          <div className={styles.contentItem}>
            <Icon name="cpu" size={40} />
            <div className={styles.item}>
              <div>{cpuRequest ? `${cpuRequest} Core` : t('No Request')}</div>
              <p>{t('Resource Request')}</p>
            </div>
            <div className={styles.item}>
              <div>{cpuLimit ? `${cpuLimit} Core` : t('No Limit')}</div>
              <p>{t('Resource Limit')}</p>
            </div>
          </div>
          <div className={styles.contentItem}>
            <Icon name="memory" size={40} />
            <div className={styles.item}>
              <div>
                {memoryRequest ? `${memoryRequest} Mi` : t('No Request')}
              </div>
              <p>{t('Resource Request')}</p>
            </div>
            <div className={styles.item}>
              <div>{memoryLimit ? `${memoryLimit} Mi` : t('No Limit')}</div>
              <p>{t('Resource Limit')}</p>
            </div>
          </div>
        </div>
      </Panel>
    )
  }
}
