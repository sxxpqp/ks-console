import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { inject } from 'mobx-react'

import { Panel } from 'components/Base'
import VolumeItem from './Item'

import styles from './index.scss'

@inject('projectStore')
export default class VolumesCard extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    volumes: PropTypes.array,
    containers: PropTypes.array,
    loading: PropTypes.bool,
  }

  static defaultProps = {
    volumes: [],
    containers: [],
    loading: true,
  }

  get isMultiProject() {
    return this.props.projectStore.detail.isFedManaged
  }

  getVolumeMounts = volume => {
    const { containers } = this.props
    const mounts = []

    containers.forEach(container => {
      if (!isEmpty(container.volumeMounts)) {
        container.volumeMounts.forEach(mount => {
          if (mount.name === volume.mountName) {
            mounts.push({
              ...mount,
              containerName: container.name,
              accessMode: mount.readOnly ? 'read-only' : 'read-write',
            })
          }
        })
      }
    })
    return mounts
  }

  renderContent() {
    const { volumes, match } = this.props

    if (isEmpty(volumes)) return null

    return volumes.map((item, index) => {
      item.volumeMounts = this.getVolumeMounts(item)
      return (
        <VolumeItem
          key={index}
          volume={item}
          match={match}
          isMultiProject={this.isMultiProject}
        />
      )
    })
  }

  render() {
    const { className } = this.props
    const title = this.props.title || t('Volumes')

    return (
      <Panel className={className} title={title}>
        <div className={styles.wrapper}>{this.renderContent()}</div>
      </Panel>
    )
  }
}
