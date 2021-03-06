import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { get, set, isEmpty, isUndefined } from 'lodash'
import { Columns, Column } from '@kube-design/components'
import { List } from 'components/Base'
import { isNotPersistentVolume } from 'utils/volume'

import Card from './Card'

import styles from './index.scss'

export default class VolumeList extends React.Component {
  static propTypes = {
    prefix: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.array,
    volumes: PropTypes.array,
    volumeTypes: PropTypes.array,
    containers: PropTypes.array,
    onChange: PropTypes.func,
    onShowVolume: PropTypes.func,
    onShowConfig: PropTypes.func,
    onShowEdit: PropTypes.func,
  }

  static defaultProps = {
    prefix: '',
    name: '',
    value: [],
    volumes: [],
    volumeTypes: [],
    containers: [],
    onChange() {},
    onShowVolume() {},
    onShowConfig() {},
    onShowEdit() {},
  }

  static contextTypes = {
    formData: PropTypes.object,
  }

  getFormattedVolumes = () => {
    const { value, volumes, containers, logPath } = this.props

    if (isEmpty(value)) {
      return []
    }

    return value.map(item => {
      let volume = {}
      if (!isUndefined(item.persistentVolumeClaim)) {
        volume = volumes.find(
          v => v.name === item.persistentVolumeClaim.claimName
        )
      }

      const volumeMounts = []
      containers.forEach(container => {
        if (container.volumeMounts) {
          const volumeMount = container.volumeMounts.find(
            vm => vm.name === item.name
          )

          if (volumeMount) {
            const log = get(
              logPath,
              `containerLogConfigs.${container.name}.${item.name}`,
              []
            ).join(',')

            volumeMounts.push({
              ...volumeMount,
              logPath: log,
              containerName: container.name,
            })
          }
        }
      })

      return { ...item, volume, volumeMounts }
    })
  }

  deleteVolumeMounts = name => {
    const { formData } = this.context

    const key = `${this.props.prefix}spec.containers`
    const containers = get(formData, key, [])

    containers.forEach(container => {
      if (!isEmpty(container.volumeMounts)) {
        container.volumeMounts = container.volumeMounts.filter(
          vm => vm.name !== name
        )
      }
    })

    set(formData, key, containers)
  }

  handleAddVolume = () => {
    this.props.onShowVolume()
  }

  handleAddConfig = () => {
    this.props.onShowConfig()
  }

  handleEdit = data => {
    const { volume, volumeMounts, ...rest } = data

    if (isNotPersistentVolume(data)) {
      this.props.onShowEdit({
        ...rest,
        volumeMounts,
      })
    } else {
      this.props.onShowEdit({
        volume,
        volumeMounts,
        specVolume: { ...rest },
      })
    }
  }

  handleDelete = name => {
    const { value, onChange } = this.props

    this.deleteVolumeMounts(name)

    onChange(value.filter(item => item.name !== name))
  }

  renderAddVolume() {
    return (
      <Columns>
        <Column>
          <List.Add
            onClick={this.handleAddVolume}
            title={t('Add Volume')}
            description={t('Support EmptyDir and PersistentVolumeClaim.')}
          />
        </Column>
        <Column>
          <List.Add
            onClick={this.handleAddConfig}
            title={t('Mount ConfigMap or Secret')}
            description={t(
              'Mount the configmap or secret to the specified directory.'
            )}
          />
        </Column>
      </Columns>
    )
  }

  render() {
    const { className } = this.props

    const formatVolumes = this.getFormattedVolumes()

    return (
      <div className={classNames(styles.wrapper, className)}>
        <div className={styles.content}>
          {!isEmpty(formatVolumes) && (
            <ul className={styles.list}>
              {formatVolumes.map(volume => (
                <Card
                  volume={volume}
                  key={volume.name}
                  onEdit={this.handleEdit}
                  onDelete={this.handleDelete}
                />
              ))}
            </ul>
          )}
          {this.renderAddVolume()}
        </div>
      </div>
    )
  }
}
