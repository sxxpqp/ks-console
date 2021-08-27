import React from 'react'
import { get, set, unset } from 'lodash'
import { MODULE_KIND_MAP } from 'utils/constants'
import { Form } from '@kube-design/components'
import { TypeSelect } from 'components/Base'

import FormTemplate from './FormTemplate'
import SnapshotForm from './SnapshotForm'

const CREATE_TYPE_OPTIONS = [
  {
    icon: 'snapshot',
    value: true,
    get label() {
      return t('CREATE_VOLUME_BY_SNAPSHOT')
    },
    get description() {
      return t('SELECT_SNAPSHOT_TO_CREATE_VOLUME')
    },
  },
  {
    icon: 'database',
    value: false,
    get label() {
      return t('CREATE_VOLUME_BY_STORAGECLASS')
    },
    get description() {
      return t('STORAGE_CLASS_DESC')
    },
  },
]

export default class VolumeSettings extends React.Component {
  get formTemplate() {
    const { formTemplate, module } = this.props
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  get fedFormTemplate() {
    return this.props.isFederated
      ? get(this.formTemplate, 'spec.template')
      : this.formTemplate
  }

  state = {
    fromSnapshot: !!get(this.formTemplate, 'spec.dataSource.name'),
  }

  handeChange = fromSnapshot => {
    if (fromSnapshot !== this.state.fromSnapshot) {
      unset(this.fedFormTemplate, 'spec.storageClassName')
      set(this.fedFormTemplate, 'spec.accessModes', [])
      set(this.fedFormTemplate, 'spec.dataSource', {})
      set(this.fedFormTemplate, 'spec.resources.requests.storage', '0Gi')
      this.setState({ fromSnapshot })
    }
  }

  render() {
    const { formRef, isFederated, cluster } = this.props
    const { fromSnapshot } = this.state

    return (
      <Form data={this.fedFormTemplate} ref={formRef}>
        {!isFederated && (
          <Form.Item label={t('Method')}>
            <TypeSelect
              value={fromSnapshot}
              options={CREATE_TYPE_OPTIONS}
              onChange={this.handeChange}
            />
          </Form.Item>
        )}
        {fromSnapshot ? (
          <SnapshotForm
            namespace={get(this.formTemplate, 'metadata.namespace')}
            cluster={cluster}
          />
        ) : (
          <FormTemplate cluster={cluster} />
        )}
      </Form>
    )
  }
}
