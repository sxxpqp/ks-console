import React, { Component } from 'react'
import { pick } from 'lodash'

import EditForm from '../EditForm'
import Ports from '../../ContainerSettings/ContainerForm/Ports'

import styles from './index.scss'

export default class ContainerPorts extends Component {
  handleSubmit = data => {
    const { index, containerType, onEdit } = this.props
    onEdit({ index, containerType, data: pick(data, ['ports']) })
  }

  render() {
    const { formData, containerType, withService } = this.props

    const showServicePort = containerType !== 'init' ? withService : false

    const title = (
      <>
        <div>{`${t('Image')}: ${formData.image}`}</div>
        {formData.ports &&
          formData.ports.map((port, index) => (
            <div key={index} className={styles.port}>
              <span>{`${t('Protocol')}: ${port.protocol}`}</span>
              <span>{`${t('Name')}: ${port.name}`}</span>
              <span>{`${t('Container Port')}: ${port.containerPort}`}</span>
              {showServicePort && (
                <span>{`${t('Service Port')}: ${port.servicePort}`}</span>
              )}
            </div>
          ))}
      </>
    )

    return (
      <EditForm {...this.props} title={title} onOk={this.handleSubmit}>
        <Ports withService={containerType !== 'init' ? withService : false} />
      </EditForm>
    )
  }
}
