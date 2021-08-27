import React from 'react'
import { get, set } from 'lodash'
import { toJS } from 'mobx'
import { Form } from '@kube-design/components'
import ComponentSelect from './ComponentSelect'

import styles from './index.scss'

import Title from '../Title'

export default class ServiceComponents extends React.Component {
  constructor(props) {
    super(props)
    this.init()
  }

  init() {
    const { formTemplate } = this.props
    const { template, components = [] } = toJS(
      get(this.props.store.kubekey, 'parameters.kubesphere', {})
    )

    set(formTemplate, 'spec.addons[1]', template)

    const values = get(formTemplate, 'spec.addons[1].sources.chart.values', [])
    components.forEach(component => {
      if (component.parameters) {
        component.parameters.forEach(param => {
          if ('default' in param) {
            values.push(`${component.name}.${param.name}=${param.default}`)
          }
        })
      }
    })
    set(formTemplate, 'spec.addons[1].sources.chart.values', values)
  }

  render() {
    const { formRef, formTemplate } = this.props
    return (
      <div className={styles.wrapper}>
        <Title
          title={t('Service Components')}
          description={t('CLUSTER_COMPONENTS_DESC')}
        />
        <Form className={styles.form} data={formTemplate} ref={formRef}>
          <Form.Item>
            <ComponentSelect
              name="spec.addons[1].sources.chart.values"
              components={get(
                this.props.store.kubekey,
                'parameters.kubesphere.components',
                []
              )}
            />
          </Form.Item>
        </Form>
      </div>
    )
  }
}
