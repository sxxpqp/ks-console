import React, { Component } from 'react'
import { map, groupBy, sortBy } from 'lodash'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import { Icon } from '@kube-design/components'
import Cascader from 'components/Base/Cascader'

import PromQLInput from '../PromQLInput'

import styles from './index.scss'

@observer
export default class MetircQueryInput extends Component {
  @computed
  get groupedMetrics() {
    const ruleRegex = /:\w+:/
    let metrics = [...this.props.supportMetrics]
    metrics = metrics.filter(metric => !ruleRegex.test(metric.value))
    metrics = groupBy(metrics, metric => metric.value.split('_')[0])
    metrics = map(metrics, (metricsForPrefix, prefix) => {
      const prefixIsMetric =
        metricsForPrefix.length === 1 && metricsForPrefix[0] === prefix
      const children = prefixIsMetric
        ? []
        : metricsForPrefix.map(item => ({
            label: item.value,
            value: item.value,
            desc: item.desc,
          }))

      return {
        children: sortBy(children, 'label'),
        label: prefix,
        value: prefix,
      }
    })
    return sortBy(metrics, 'label')
  }

  handleMetricSelect = value => {
    this.props.onChange(value)
  }

  render() {
    const {
      name,
      value,
      onChange,
      labelsets,
      onLabelSearch,
      supportMetrics,
      supportDebugButton = false,
    } = this.props

    return (
      <div className={styles.wrapper}>
        <Cascader
          options={this.groupedMetrics}
          onSelect={this.handleMetricSelect}
        >
          <span className={styles.trigger}>
            {t('MONITOR_METRICS')}
            <Icon type="light" name={'caret-down'} />
          </span>
        </Cascader>
        <div className={styles.input}>
          <PromQLInput
            name={name}
            value={value}
            onChange={onChange}
            metrics={supportMetrics}
            labelsets={labelsets}
            onLabelSearch={onLabelSearch}
          />
        </div>
        {supportDebugButton && (
          <div
            onClick={this.props.onDebugClick}
            className={classnames(styles.debug, styles.btn)}
          >
            <Icon name={'terminal'} type="light" />{' '}
            <span>{t('DEBUGB_DATA')}</span>
          </div>
        )}
      </div>
    )
  }
}
