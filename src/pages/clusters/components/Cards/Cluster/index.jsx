import React from 'react'
import { Columns, Column } from '@kube-design/components'
import { Text } from 'components/Base'
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

    return (
      <li className={styles.wrapper} data-test="cluster-item">
        <Columns>
          <Column className="is-4">
            <ClusterTitle cluster={data} onClick={this.handleClick} />
          </Column>
          <Column className="is-2">
            <Text title={data.nodeCount} description={t('Node Count')} />
          </Column>
          <Column className="is-2">
            <Text
              title={data.kubernetesVersion}
              description={t('Kubernetes Version')}
            />
          </Column>
          <Column className="is-2">
            <Text title={data.provider} description={t('Provider')} />
          </Column>
          <Column className="is-2">
            <Text
              title={getLocalTime(data.createTime).format(
                `YYYY-MM-DD HH:mm:ss`
              )}
              description={t('Created Time')}
            />
          </Column>
        </Columns>
      </li>
    )
  }
}
