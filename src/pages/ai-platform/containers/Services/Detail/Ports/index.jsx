import React, { Component } from 'react'
import { Icon, Tooltip } from '@kube-design/components'

import { isEmpty } from 'lodash'

import styles from './index.scss'

export default class Ports extends Component {
  render() {
    const { detail } = this.props

    if (isEmpty(detail.ports)) {
      return null
    }

    return (
      <div className={styles.portsWrapper}>
        {detail.ports.map((port, index) => (
          <div key={index} className={styles.ports}>
            <Icon name="pod" size={40} />
            <div className={styles.port}>
              <p>
                <strong>{port.targetPort}</strong>
              </p>
              <p>{t('Container Port')}</p>
            </div>
            <div className={styles.protocol}>→ {port.protocol} → </div>
            <Icon name="network-router" size={40} />
            <div className={styles.port}>
              <p>
                <strong>{port.port}</strong>
              </p>
              <p>{t('Service Port')}</p>
            </div>
            {port.nodePort && (
              <>
                <div className={styles.protocol}>→ {port.protocol} → </div>
                <Icon name="nodes" size={40} />
                <div className={styles.port}>
                  <p>
                    <strong>{port.nodePort}</strong>
                  </p>
                  <div>
                    {t('Node Port')}
                    <Tooltip
                      content={t('SERVICE_NODE_PORT_DESC')}
                      trigger="hover"
                    >
                      <Icon name="information" />
                    </Tooltip>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    )
  }
}
