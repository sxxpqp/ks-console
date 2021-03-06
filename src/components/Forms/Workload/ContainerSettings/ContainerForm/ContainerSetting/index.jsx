import React from 'react'
import {
  get,
  // isEmpty
} from 'lodash'
import { generateId, parseDockerImage } from 'utils'

import { PATTERN_NAME } from 'utils/constants'

import {
  Form,
  Tag,
  // Alert,
  Input,
  Select,
  Columns,
  Column,
} from '@kube-design/components'
// import { ResourceLimit } from 'components/Inputs'
import ToggleView from 'components/ToggleView'

import ImageInput from './ImageInput'

import styles from './index.scss'

export default class ContainerSetting extends React.Component {
  get defaultResourceLimit() {
    const { limitRange = {} } = this.props

    if (!limitRange.defaultRequest && !limitRange.default) {
      return undefined
    }

    return {
      requests: limitRange.defaultRequest || {},
      limits: limitRange.default || {},
    }
  }

  get containerTypes() {
    return [
      { label: t('Worker Container'), value: 'worker' },
      { label: t('Init Container'), value: 'init' },
    ]
  }

  get imageRegistries() {
    return this.props.imageRegistries.map(item => {
      const auths = get(item, 'data[".dockerconfigjson"].auths', {})
      const url = Object.keys(auths)[0] || ''
      const username = get(auths[url], 'username')
      const cluster = item.isFedManaged
        ? get(item, 'clusters[0].name')
        : item.cluster

      return {
        url,
        username,
        label: item.name,
        value: item.name,
        cluster,
        alias: get(item, 'annotations["kubesphere.io/alias-name"]') || '',
      }
    })
  }

  limitError = ''

  getFormTemplate(data, imageRegistries) {
    if (data && data.image && !data.pullSecret) {
      const { registry } = parseDockerImage(data.image)
      if (registry) {
        const reg = imageRegistries.find(({ url }) => url.endsWith(registry))
        if (reg) {
          data.pullSecret = reg.value
        }
      }
    }
    return data
  }

  valueRenderer = option => (
    <Tag
      className={styles.type}
      type={option.value === 'init' ? 'warning' : 'default'}
    >
      {option.label}
    </Tag>
  )

  renderImageForm = () => {
    const { data, namespace, rootStore } = this.props
    const imageRegistries = this.imageRegistries
    const formTemplate = this.getFormTemplate(data, imageRegistries)

    return (
      <ImageInput
        className={styles.imageSearch}
        name="image"
        namespace={namespace}
        formTemplate={formTemplate}
        imageRegistries={imageRegistries}
        rootStore={rootStore}
      />
    )
  }

  handleError = err => {
    this.limitError = err
  }

  limitValidator = (rule, value, callback) => {
    if (this.limitError !== '') {
      callback({ message: '' })
    }
    callback()
  }

  renderAdvancedSettings() {
    const { defaultContainerType, onContainerTypeChange } = this.props
    // const defaultResourceLimit = this.defaultResourceLimit
    return (
      <ToggleView defaultShow={false}>
        {/* <ToggleView defaultShow={isEmpty(defaultResourceLimit)}> */}
        <>
          <Columns className={styles.columns}>
            <Column>
              <Form.Item
                label={t('Container Name')}
                desc={t('NAME_DESC')}
                rules={[
                  { required: true, message: t('Please input name') },
                  {
                    pattern: PATTERN_NAME,
                    message: t('Invalid name', { message: t('NAME_DESC') }),
                  },
                ]}
              >
                <Input
                  name="name"
                  defaultValue={`container-${generateId()}`}
                  maxLength={63}
                />
              </Form.Item>
            </Column>
            <Column>
              <Form.Item label={t('Container Type')}>
                <Select
                  name="type"
                  defaultValue={defaultContainerType}
                  options={this.containerTypes}
                  onChange={onContainerTypeChange}
                  valueRenderer={this.valueRenderer}
                />
              </Form.Item>
            </Column>
          </Columns>
          {/* <Alert
            className="margin-b12"
            type="warning"
            message={t('CONTAINER_RESOURCE_LIMIT_TIP')}
          />
          <Form.Item
            rules={[{ validator: this.limitValidator, checkOnSubmit: true }]}
          >
            <ResourceLimit
              name="resources"
              defaultValue={defaultResourceLimit}
              onError={this.handleError}
            />
          </Form.Item> */}
        </>
      </ToggleView>
    )
  }

  render() {
    const { className } = this.props
    return (
      <Form.Group
        className={className}
        label={t('Container Settings')}
        desc={t('Please set the container name and computing resources.')}
        noWrapper
      >
        {this.renderImageForm()}
        {this.renderAdvancedSettings()}
      </Form.Group>
    )
  }
}
