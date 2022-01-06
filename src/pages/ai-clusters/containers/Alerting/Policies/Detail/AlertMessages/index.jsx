import React from 'react'
import { observer } from 'mobx-react'
import { get, capitalize, isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import { Tag } from '@kube-design/components'

import { getLocalTime } from 'utils'
import { MODULE_KIND_MAP } from 'utils/constants'
import { getAlertingResource } from 'utils/alerting'
import AlertMessageStore from 'stores/alerting/message'
import { Panel, Text } from 'components/Base'
import BaseTable from 'components/Tables/Base'

import { SEVERITY_LEVEL } from 'configs/alerting/metrics/rule.config'

import styles from './index.scss'

@observer
export default class AlertHistory extends React.Component {
  constructor(props) {
    super(props)

    this.store = new AlertMessageStore()
  }

  get type() {
    return this.props.match.url.indexOf('alert-rules/builtin') > 0
      ? 'builtin'
      : ''
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = params => {
    const { cluster, namespace, name } = this.props.match.params
    const data = {
      ...params,
      cluster,
      namespace,
      ruleName: name,
      type: this.type,
    }
    this.store.fetchList(data)
  }

  getResourceType = type => {
    const str = capitalize(type)
    return t('ALERT_TYPE', { type: t(str) })
  }

  getPrefix({ cluster, namespace } = {}) {
    const {
      cluster: _cluster,
      namespace: _namespace,
      workspace,
    } = this.props.match.params
    cluster = cluster || _cluster
    namespace = namespace || _namespace
    return `${workspace ? `/${workspace}` : ''}/clusters/${cluster}${
      namespace ? `/projects/${namespace}` : ''
    }`
  }

  getColumns = () => [
    {
      title: t('Alerting Message'),
      dataIndex: 'value',
      render: (value, record) => (
        <Text
          icon="loudspeaker"
          title={get(record, 'annotations.summary')}
          description={get(record, 'annotations.message', '-')}
        />
      ),
    },
    {
      title: t('Level'),
      dataIndex: 'labels.severity',
      width: '15%',
      render: severity => {
        const level = SEVERITY_LEVEL.find(item => item.value === severity)
        if (level) {
          return <Tag type={level.type}>{t(level.label)}</Tag>
        }
        return <Tag>{severity}</Tag>
      },
    },
    {
      title: t('Alerting Resource'),
      dataIndex: 'labels',
      isHideable: true,
      width: '20%',
      render: labels => {
        const { module, name, namespace } = getAlertingResource(labels)
        if (!module) {
          return '-'
        }

        return (
          <Link to={`${this.getPrefix({ namespace })}/${module}/${name}`}>
            {t(MODULE_KIND_MAP[module])}: {name}
          </Link>
        )
      },
    },
    {
      title: t('Time'),
      dataIndex: 'activeAt',
      isHideable: true,
      width: 200,
      render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  render() {
    const { data, isLoading, filters } = this.store.list

    return (
      <Panel title={t('Alerting History')} loading={isLoading}>
        {isEmpty(data) ? (
          <div>{t('No Data')}</div>
        ) : (
          <BaseTable
            className={styles.table}
            filters={filters}
            data={data}
            name="Alerting Message"
            rowKey="value"
            columns={this.getColumns()}
            selectedRowKeys={[]}
            selectActions={[]}
            hideHeader
            hideFooter
          />
        )}
      </Panel>
    )
  }
}
