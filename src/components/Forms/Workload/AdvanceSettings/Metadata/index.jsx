import { debounce, get, isEmpty, isUndefined, set } from 'lodash'
import React from 'react'
import { Form } from '@kube-design/components'
import { PropertiesInput } from 'components/Inputs'
import { isValidLabel, updateLabels, updateFederatedAnnotations } from 'utils'

export default class Metadata extends React.Component {
  get formTemplate() {
    return this.props.formTemplate
  }

  get fedFormTemplate() {
    return this.props.isFederated
      ? get(this.formTemplate, 'spec.template')
      : this.formTemplate
  }

  handleLabelsChange = debounce(value => {
    const { module, isFederated } = this.props
    updateLabels(this.fedFormTemplate, module, value)
    if (isFederated) {
      set(this.formTemplate, 'metadata.labels', value)
    }
  }, 200)

  handleAnnotationsChange = debounce(value => {
    if (this.props.isFederated) {
      set(this.formTemplate, 'metadata.annotations', value)
      updateFederatedAnnotations(this.formTemplate)
    }
  }, 200)

  labelsValidator = (rule, value, callback) => {
    if (isUndefined(value) || isEmpty(value)) {
      return callback()
    }

    if (!isValidLabel(value)) {
      return callback({ message: t('LABEL_FORMAT_DESC') })
    }

    const { namespace, cluster } = this.props
    this.props.store
      .checkLabels({ labels: value, namespace, cluster })
      .then(resp => {
        if (resp.exist) {
          return callback({ message: t('Labels exists'), field: rule.field })
        }
        callback()
      })
  }

  render() {
    return (
      <>
        <Form.Item
          label={t('Labels')}
          rules={[{ validator: this.labelsValidator }]}
        >
          <PropertiesInput
            name="metadata.labels"
            addText={t('Add Label')}
            onChange={this.handleLabelsChange}
          />
        </Form.Item>
        <Form.Item label={t('Annotations')}>
          <PropertiesInput
            name="metadata.annotations"
            addText={t('Add Annotation')}
            hiddenKeys={globals.config.preservedAnnotations}
            onChange={this.handleAnnotationsChange}
          />
        </Form.Item>
      </>
    )
  }
}
