import { get, set, isEmpty } from 'lodash'
import copy from 'fast-copy'
import React from 'react'

import { Icon, RadioButton, RadioGroup, Tooltip } from '@kube-design/components'

import ByTraffic from './ByTraffic'
import ByContent from './ByContent'

import styles from './index.scss'

export default class Canary extends React.Component {
  constructor(props) {
    super(props)
    const httpData = get(this.formTemplate, this.strategyPath, [])

    this.state = {
      mode: httpData.some(it => !isEmpty(it.match)) ? 'content' : 'traffic',
    }

    this.oldHttpData = copy(httpData)
    this.initFormTemplate(this.state.mode)
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

  initFormTemplate = mode => {
    const { formTemplate } = this.props

    const host = get(formTemplate, 'strategy.spec.template.spec.hosts[0]')
    const oldVersion = get(formTemplate, 'strategy.spec.principal')
    const newVersion = get(formTemplate, 'workload.metadata.labels.version')

    const httpData =
      mode === 'traffic'
        ? [
            {
              route: [
                { destination: { subset: oldVersion, host } },
                { destination: { subset: newVersion, host } },
              ],
            },
          ]
        : [
            {
              route: [
                { destination: { subset: newVersion, host }, weight: 100 },
              ],
            },
            {
              route: [
                { destination: { subset: oldVersion, host }, weight: 100 },
              ],
            },
          ]

    if (
      this.oldHttpData &&
      ((this.oldHttpData.length === 1 && mode === 'traffic') ||
        (this.oldHttpData.length === 2 && mode === 'content'))
    ) {
      if (mode === 'traffic') {
        const routes = get(this.oldHttpData, '[0].route', [])
        const oldRoute = routes.find(
          item => get(item, 'destination.subset') === oldVersion
        )
        const newRoute = routes.find(
          item => get(item, 'destination.subset') === newVersion
        )
        if (oldRoute && newRoute) {
          set(httpData[0], 'route[0].weight', oldRoute.weight)
          set(httpData[0], 'route[1].weight', newRoute.weight)
        }
      } else {
        const newData = this.oldHttpData.find(item => !!item.match)
        set(httpData[0], 'match', newData.match)
      }
    }

    // istio fix
    if (this.protocol === 'tcp') {
      httpData.forEach(item => {
        item.match = item.match || []
      })
    }

    set(this.formTemplate, this.strategyPath, httpData)
  }

  handleModeChange = value => {
    this.initFormTemplate(value)
    this.setState({ mode: value })
  }

  renderContent() {
    const { mode } = this.state

    if (mode === 'traffic') {
      return <ByTraffic {...this.props} />
    }

    return <ByContent {...this.props} />
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.bar}>
          <RadioGroup
            mode="button"
            value={this.state.mode}
            onChange={this.handleModeChange}
            size="small"
          >
            <RadioButton value="traffic">
              {t('Forward by traffic ratio')}
            </RadioButton>
            <RadioButton value="content" disabled={this.protocol !== 'http'}>
              {t('Forward by request content')}
            </RadioButton>
          </RadioGroup>
          {this.protocol && (
            <Tooltip content={t('POLICY_REQUEST_CONTENT_TIP')}>
              <Icon className={styles.tip} name="question" />
            </Tooltip>
          )}
        </div>
        <div className={styles.contentWrapper}>{this.renderContent()}</div>
      </div>
    )
  }
}
