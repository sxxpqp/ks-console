import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty } from 'lodash'
import { PROTOCOLS } from 'utils/constants'

import { Panel } from 'components/Base'

import styles from './index.scss'

export default class ContainerPorts extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    ports: PropTypes.array,
  }

  static defaultProps = {
    ports: [],
  }

  get protocols() {
    return PROTOCOLS.map(item => item.value)
  }

  renderContent() {
    const { ports, isFederated } = this.props

    if (isEmpty(ports)) return null

    return (
      <div className={styles.content}>
        <table className={styles.table}>
          <thead>
            <tr>
              {isFederated && <th>{t('Cluster')}</th>}
              <th>{t('Name')}</th>
              <th>{t('Protocol')}</th>
              <th>{t('Port')}</th>
            </tr>
          </thead>
          <tbody>
            {ports.map((item, index) => {
              let protocol = ''
              if (item.name && item.name.indexOf('-') !== -1) {
                protocol = (item.name.split('-')[0] || '').toUpperCase()
              }
              return (
                <tr key={index}>
                  {isFederated && <td>{item.cluster}</td>}
                  <td>{item.name}</td>
                  <td>
                    {this.protocols.includes(protocol)
                      ? `${protocol} (${item.protocol})`
                      : item.protocol}
                  </td>
                  <td>{item.containerPort}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    const { className, loading, ...rest } = this.props
    const title = this.props.title || t('Ports')

    return (
      <Panel
        className={classnames(styles.card, className)}
        title={title}
        {...rest}
      >
        {this.renderContent()}
      </Panel>
    )
  }
}
