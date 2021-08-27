import { keyBy, isEmpty } from 'lodash'
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Form, Tag } from '@kube-design/components'
import { TypeSelect } from 'components/Base'
import { MountInput } from 'components/Inputs'
import { getDisplayName } from 'utils'

import styles from './index.scss'

export default class AddExistVolumes extends React.Component {
  static propTypes = {
    formRef: PropTypes.object,
    formData: PropTypes.object,
    className: PropTypes.string,
    containers: PropTypes.array,
    volumes: PropTypes.array,
  }

  static defaultProps = {
    className: '',
    volumes: [],
    formData: {},
    containers: [],
  }

  get volumes() {
    return this.props.volumes.map(volume => ({
      uid: volume.name,
      icon: 'storage',
      label: (
        <span>
          {getDisplayName(volume)}{' '}
          <Tag>{volume.inUse ? t('In Use') : t('Idle')}</Tag>
        </span>
      ),
      description: `${t('Storage Class')}: ${volume.storageClassName}`,
      value: volume,
      details: [
        { label: volume.capacity, description: t('Capacity') },
        { label: volume.accessMode, description: t('Access Mode') },
      ],
    }))
  }

  getMountPaths(item) {
    if (!this.mountPaths) {
      this.mountPaths = keyBy(this.props.containers, 'name')
    }

    if (
      isEmpty(this.mountPaths[item.containerName]) ||
      isEmpty(this.mountPaths[item.containerName].volumeMounts)
    ) {
      return []
    }

    return this.mountPaths[item.containerName].volumeMounts
      .filter(mount => mount.name !== item.name)
      .map(mount => mount.mountPath)
  }

  mountValidator = (rule, value, callback) => {
    if (isEmpty(value)) {
      return callback()
    }

    value.forEach(item => {
      if (!item) {
        return callback()
      }

      if (item.readOnly === 'null') {
        callback()
      } else if (item.mountPath) {
        if (this.getMountPaths(item).includes(item.mountPath)) {
          return callback({
            message: t('Mount path is already in use'),
            field: rule.field,
          })
        }
        callback()
      } else {
        callback({
          message: t('Please specify the read and write mode and mount path'),
          field: rule.field,
        })
      }
    })
  }

  render() {
    const {
      containers,
      formRef,
      formData,
      className,
      collectSavedLog,
    } = this.props

    const placeholder = {
      icon: 'storage',
      label: t('Choose an existing volume'),
      description: t('CHOOSE_EXIST_VOLUME_DESC'),
    }

    return (
      <div className={classNames(styles.wrapper, className)}>
        <Form data={formData} ref={formRef}>
          <Form.Item
            rules={[{ required: true, message: t('Please select a volume') }]}
          >
            <TypeSelect
              name="volume"
              options={this.volumes}
              placeholder={placeholder}
            />
          </Form.Item>
          <Form.Item rules={[{ validator: this.mountValidator }]}>
            <MountInput
              name="volumeMounts"
              containers={containers}
              collectSavedLog={collectSavedLog}
            />
          </Form.Item>
        </Form>
      </div>
    )
  }
}
