import { get, set, isUndefined } from 'lodash'
import React from 'react'
import { Form } from '@kube-design/components'
import { TrafficSlider } from 'components/Inputs'

import styles from './index.scss'

export default class ByTraffic extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ratio: get(this.newRoute, 'weight', 50),
    }
  }

  get formTemplate() {
    return this.props.formTemplate.strategy
  }

  get strategyPath() {
    const protocol = get(this.formTemplate, 'spec.protocol', 'http')

    return `spec.template.spec.${protocol}`
  }

  get oldRoute() {
    return get(this.formTemplate, `${this.strategyPath}[0].route[0]`, {})
  }

  get newRoute() {
    return get(this.formTemplate, `${this.strategyPath}[0].route[1]`, {})
  }

  componentDidMount() {
    const oldWeight = get(this.oldRoute, 'weight')
    const newWeight = get(this.newRoute, 'weight')

    if (isUndefined(oldWeight)) {
      set(this.oldRoute, 'weight', 100 - this.state.ratio)
    }
    if (isUndefined(newWeight)) {
      set(this.newRoute, 'weight', this.state.ratio)
    }
  }

  handleRatioChange = value => {
    this.setState({ ratio: value }, () => {
      set(this.oldRoute, 'weight', 100 - value)
    })
  }

  render() {
    const { ratio } = this.state
    const { formRef, formTemplate, ...rest } = this.props

    const component = get(this.formTemplate, 'spec.template.spec.hosts[0]')
    const newVersion = get(this.newRoute, 'destination.subset')
    const oldVersion = get(this.oldRoute, 'destination.subset')

    const leftContent = `${newVersion} ${t('traffic')}`
    const rightContent = `${oldVersion} ${t('traffic')}`

    return (
      <div className={styles.wrapper}>
        <div className={styles.item}>
          <div className={styles.title}>{t('Rule Description')}</div>
          <p>{t('CANARY_BY_TRAFFIC_DESC', { ratio, component, newVersion })}</p>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>{t('Traffic Ratio')}</div>
          <Form ref={formRef} data={this.formTemplate} {...rest}>
            <Form.Item>
              <TrafficSlider
                name={`${this.strategyPath}[0].route[1].weight`}
                min={0}
                max={100}
                leftContent={leftContent}
                rightContent={rightContent}
                onChange={this.handleRatioChange}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}
