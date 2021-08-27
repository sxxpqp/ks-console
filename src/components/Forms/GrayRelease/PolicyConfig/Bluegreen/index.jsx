import React from 'react'
import { get, set, isEmpty } from 'lodash'
import { Form } from '@kube-design/components'

import VersionSelect from './VersionSelect'

import styles from './index.scss'

export default class Bluegreen extends React.Component {
  state = {
    versions: [],
  }

  componentDidMount() {
    const { formTemplate } = this.props

    const host = get(formTemplate, 'strategy.spec.template.spec.hosts[0]')
    const oldVersion = get(formTemplate, 'strategy.spec.principal')
    const newVersion = get(formTemplate, 'workload.metadata.labels.version')
    const newReplicas = get(formTemplate, 'workload.spec.replicas')
    const oldReplicas = get(
      formTemplate,
      'strategy.metadata.annotations["servicemesh.kubesphere.io/workloadReplicas"]',
      0
    )

    const httpData = [
      {
        route: [
          { destination: { subset: oldVersion, host }, weight: 100 },
          { destination: { subset: newVersion, host }, weight: 0 },
        ],
      },
    ]

    // istio fix
    if (this.protocol === 'tcp') {
      httpData.forEach(item => {
        item.match = item.match || []
      })
    }

    if (isEmpty(get(this.formTemplate, 'spec.governor'))) {
      set(this.formTemplate, 'spec.governor', oldVersion)
    }

    if (isEmpty(get(this.formTemplate, this.strategyPath))) {
      set(this.formTemplate, this.strategyPath, httpData)
    }

    this.setState({
      versions: [
        { name: oldVersion, replicas: oldReplicas },
        { name: newVersion, replicas: newReplicas },
      ],
    })
  }

  get formTemplate() {
    return this.props.formTemplate.strategy
  }

  get protocol() {
    return get(this.formTemplate, 'spec.protocol', 'http')
  }

  get strategyPath() {
    return `spec.template.spec.${this.protocol}`
  }

  handleVersionChange = version => {
    const oldVersion = get(this.formTemplate, 'spec.principal')

    if (oldVersion === version) {
      set(this.formTemplate, `${this.strategyPath}[0].route[0].weight`, 100)
      set(this.formTemplate, `${this.strategyPath}[0].route[1].weight`, 0)
    } else {
      set(this.formTemplate, `${this.strategyPath}[0].route[0].weight`, 0)
      set(this.formTemplate, `${this.strategyPath}[0].route[1].weight`, 100)
    }
  }

  render() {
    const { formRef, formTemplate, ...rest } = this.props
    return (
      <div className={styles.wrapper}>
        <div className={styles.item}>
          <div className={styles.title}>{t('Rule Description')}</div>
          <p>{t('Two Versions')}</p>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>{t('Traffic Rules')}</div>
          <Form ref={formRef} data={this.formTemplate} {...rest}>
            <Form.Item>
              <VersionSelect
                name="spec.governor"
                options={this.state.versions}
                onChange={this.handleVersionChange}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}
