import React from 'react'
import { get } from 'lodash'
import { MODULE_KIND_MAP } from 'utils/constants'

import { Form } from '@kube-design/components'

import Metadata from './Metadata'
import NodeSchedule from './NodeSchedule'
import PodIPRange from './PodIPRange'

export default class AdvancedSettings extends React.Component {
  get namespace() {
    return get(this.formTemplate, 'metadata.namespace')
  }

  get formTemplate() {
    const { formTemplate, module } = this.props
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  get fedFormTemplate() {
    return this.props.isFederated
      ? get(this.formTemplate, 'spec.template')
      : this.formTemplate
  }

  render() {
    const { formRef, store, module, cluster, prefix, isFederated } = this.props
    return (
      <Form data={this.fedFormTemplate} ref={formRef}>
        {globals.app.hasClusterModule(cluster, 'network.ippool') &&
          !isFederated && (
            <PodIPRange
              prefix={prefix}
              cluster={cluster}
              namespace={this.namespace}
            />
          )}
        {module !== 'daemonsets' && (
          <Form.Group
            label={t('Set Node Scheduling Policy')}
            desc={t('You can allow Pod replicas to run on specified nodes.')}
            checkable
          >
            <NodeSchedule
              prefix={prefix}
              cluster={cluster}
              namespace={this.namespace}
              formTemplate={this.fedFormTemplate}
            />
          </Form.Group>
        )}
        <Form.Group
          label={t('Add Metadata')}
          desc={t(
            'Additional metadata settings for resources such as Labels and Annotations.'
          )}
          keepDataWhenUnCheck
          checkable
        >
          <Metadata
            store={store}
            module={module}
            cluster={cluster}
            namespace={this.namespace}
            formTemplate={this.formTemplate}
            isFederated={isFederated}
          />
        </Form.Group>
      </Form>
    )
  }
}
