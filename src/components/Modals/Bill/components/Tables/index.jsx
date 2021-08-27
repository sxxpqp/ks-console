import React from 'react'
import Table from 'components/Tables/Base'

import { isEmpty, get } from 'lodash'
import { Tooltip, Icon } from '@kube-design/components'

import { METER_RESOURCE_TITLE } from '../../constats'
import styles from './index.scss'

export default class MeterTable extends React.Component {
  renderTooltipContent = () => {
    return (
      <div className={styles.tooltipContent}>
        <h3>{t('Total Consumer Meaning')}</h3>
        <p>{t('Total Consumer Desc')}</p>
      </div>
    )
  }

  getColumns = () => {
    return [
      {
        title: t('Resource Type'),
        dataIndex: 'type',
        render: (value, record) => {
          return (
            <>
              <span
                style={{
                  background: record.color,
                }}
              />
              {t(METER_RESOURCE_TITLE[value])}
            </>
          )
        },
      },
      {
        title: t('Max Usage'),
        dataIndex: 'max_value',
        render: (value, record) => {
          return (
            <>
              {value} {get(record, 'unit.label', '-')}
            </>
          )
        },
      },
      {
        title: t('Min Usage'),
        dataIndex: 'min_value',
        render: (value, record) => {
          return (
            <>
              {value} {get(record, 'unit.label', '-')}
            </>
          )
        },
      },
      {
        title: t('Average Usage'),
        dataIndex: 'avg_value',
        render: (value, record) => {
          return (
            <>
              {value} {get(record, 'unit.label', '-')}
            </>
          )
        },
      },
      {
        title: (
          <div className={styles.question}>
            {t('Total Consumption')}
            <Tooltip content={this.renderTooltipContent()} placement="top">
              <Icon name="question" size={16} />
            </Tooltip>
          </div>
        ),
        dataIndex: 'sum_value',
        render: (value, record) => {
          return (
            <>
              {value} {get(record, 'unit.label', '-')}
            </>
          )
        },
      },
      ...(!isEmpty(this.props.priceConfig)
        ? [
            {
              title: `${t('Price')}`,
              dataIndex: 'fee',
              render: value => {
                const priceUint =
                  this.props.priceConfig.currency === 'CNY' ? t('￥') : t('$')

                return `${priceUint} ${parseFloat(value).toFixed(2)}`
              },
            },
          ]
        : []),
    ]
  }

  render() {
    const { data } = this.props

    return (
      <div className={styles.tableContainer}>
        <Table
          hideHeader
          hideFooter
          rowKey="type"
          data={data}
          loading={isEmpty(data)}
          columns={this.getColumns()}
        />
      </div>
    )
  }
}
