import React, { Component } from 'react'

import styles from './index.scss'

export default class ContainerPorts extends Component {
  render() {
    const { container } = this.props

    return (
      <div>
        <div>{`${t('Image')}: ${container.image}`}</div>
        {container.ports &&
          container.ports.map((port, index) => (
            <div key={index} className={styles.port}>
              <span>{`${t('Protocol')}: ${port.protocol}`}</span>
              <span>{`${t('Name')}: ${port.name}`}</span>
              <span>{`${t('Container Port')}: ${port.containerPort}`}</span>
              <span>{`${t('Service Port')}: ${port.servicePort}`}</span>
            </div>
          ))}
      </div>
    )
  }
}
