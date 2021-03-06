import { get, set, unset } from 'lodash'
import React from 'react'
import { Form, Input } from '@kube-design/components'
// import { Form, Select, Columns, Column, Input } from '@kube-design/components'
import { PropertiesInput } from 'components/Inputs'
import { updateFederatedAnnotations } from 'utils'

import styles from './index.scss'

export default class InternetAccess extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mode: get(this.formTemplate, 'spec.type', 'ClusterIP'),
    }
  }

  get fedPreifx() {
    return this.props.isFederated ? 'spec.template.' : ''
  }

  get formTemplate() {
    return this.props.formTemplate.Service
  }

  get accessModes() {
    return [
      {
        label:
          'NodePort：通过节点端口的方式访问，会随机在可用的端口池中进行选择，也可以通过配置文件指定',
        desc: t('ACCESS_NODEPORT_TIP'),
        value: 'NodePort',
      },
      // {
      //   label: 'LoadBalancer',
      //   desc: t('ACCESS_LOADBALANCER_TIP'),
      //   value: 'LoadBalancer',
      // },
    ]
  }

  componentDidMount() {
    // debugger
    // 默认设置NodePort
    this.handleAccessModeChange('NodePort')
  }

  handleAccessModeChange = mode => {
    if (mode === 'LoadBalancer') {
      let annotations = get(this.formTemplate, 'metadata.annotations', {})
      annotations = {
        ...globals.config.loadBalancerDefaultAnnotations,
        ...annotations,
      }
      set(this.formTemplate, 'metadata.annotations', annotations)
    } else {
      Object.keys(globals.config.loadBalancerDefaultAnnotations).forEach(
        key => {
          unset(this.formTemplate, `metadata.annotations["${key}"]`)
        }
      )
    }

    if (this.props.isFederated) {
      updateFederatedAnnotations(this.formTemplate)
    }

    this.setState({ mode })
  }

  handleInputChange = port => {
    debugger
    if (port) {
      set(this.formTemplate, `spec.ports.nodePort`, port)
    } else {
      unset(this.formTemplate, `spec.ports.nodePort`)
    }
  }

  handleAnnotationsChange = () => {
    if (this.props.isFederated) {
      updateFederatedAnnotations(this.formTemplate)
    }
  }

  optionRenderer = option => (
    <div className={styles.option}>
      <div>{option.label}</div>
      <p>{option.desc}</p>
    </div>
  )

  render() {
    const { mode } = this.state

    return (
      <>
        <Form.Item label={t('Access Method')}>
          <Input
            disabled
            name={`Service.${this.fedPreifx}spec.type`}
            // options={this.accessModes}
            // value={['NodePort']}
            defaultValue={'NodePort'}
            // onChange={this.handleAccessModeChange}
            // optionRenderer={this.optionRenderer}
          />
        </Form.Item>

        {mode === 'LoadBalancer' && (
          <Form.Item label={t('Annotations')}>
            <PropertiesInput
              name="Service.metadata.annotations"
              hiddenKeys={globals.config.preservedAnnotations}
              onChange={this.handleAnnotationsChange}
              addText={t('Add Annotation')}
            />
          </Form.Item>
        )}
      </>
    )
  }
}
