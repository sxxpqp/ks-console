import React from 'react'
import { Form } from '@kube-design/components'
import { AnnotationsInput, PropertiesInput } from 'components/Inputs'

export default class Metadata extends React.Component {
  render() {
    return (
      <>
        <Form.Item label={t('Annotations')}>
          <AnnotationsInput
            name="metadata.annotations"
            addText={t('Add Annotation')}
            hiddenKeys={globals.config.preservedAnnotations}
          />
        </Form.Item>
        <Form.Item label={t('Labels')}>
          <PropertiesInput name="metadata.labels" addText={t('Add Label')} />
        </Form.Item>
      </>
    )
  }
}
