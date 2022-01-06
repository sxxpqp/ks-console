import React from 'react'
import { capitalize, get } from 'lodash'
import { Link } from 'react-router-dom'

import { Tag, Button as KButton } from '@kube-design/components'

import { Text, Status } from 'components/Base'
import Banner from 'components/Cards/Banner'
import withList, { ListPage } from 'components/HOCs/withList'

import Table from 'components/Tables/List'

import { getLocalTime } from 'utils'
import { MODULE_KIND_MAP } from 'utils/constants'
import { getAlertingResource, ALERTING_STATUS } from 'utils/alerting'

import { SEVERITY_LEVEL } from 'configs/alerting/metrics/rule.config'

import MessageStore from 'stores/alerting/message'
import {
  // Popover,
  Form,
  Row,
  Col,
  Radio,
} from 'antd'

@withList({
  store: new MessageStore(),
  module: 'alerts',
  name: 'Alerting Message',
})
export default class AlertingPolicy extends React.Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
    this.table = React.createRef()
  }

  state = {
    type: location.search.indexOf('type=builtin') > 0 ? 'builtin' : 'custom',
  }

  componentDidMount() {
    const { cluster, namespace } = this.props.match.params
    !namespace && this.props.store.fetchCount({ cluster })
  }

  get tabs() {
    return {
      value: this.state.type,
      onChange: this.handleTabChange,
      options: [
        {
          value: 'custom',
          label: t('Custom Policies'),
          count: this.props.store.ruleCount,
        },
        {
          value: 'builtin',
          label: t('Built-In Policies'),
          count: this.props.store.builtinRuleCount,
        },
      ],
    }
  }

  handleTabChange = type => {
    this.setState({ type }, () => {
      this.props.store.list.reset()
      this.getData()
    })
  }

  // get tips() {
  //   return [
  //     {
  //       title: t('REQUESTS_FOR_TRIGGER_AN_ALARM_Q'),
  //       description: t('REQUESTS_FOR_TRIGGER_AN_ALARM_A'),
  //     },
  //   ]
  // }

  getData = params => {
    this.props.store.fetchList({
      ...this.props.match.params,
      ...params,
      type: this.state.type,
    })
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

  getTableProps() {
    const { tableProps } = this.props
    return {
      tableActions: {
        ...tableProps.tableActions,
        selectActions: [],
      },
      emptyProps: {
        desc: t('ALERT_MESSAGE_DESC'),
      },
    }
  }

  getResourceType = type => {
    const str = capitalize(type)
    return t('ALERT_TYPE', { type: t(str) })
  }

  getAlertingTypes() {
    return SEVERITY_LEVEL.map(level => ({
      text: t(level.label),
      value: level.value,
    }))
  }

  getStatus() {
    return ALERTING_STATUS.map(status => ({
      text: t(`ALERT_RULE_${status.toUpperCase()}`),
      value: status,
    }))
  }

  getColumns = () => {
    const { getFilteredValue } = this.props
    return [
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
        title: t('Alerting Status'),
        dataIndex: 'state',
        filters: this.getStatus(),
        filteredValue: getFilteredValue('state'),
        isHideable: true,
        search: true,
        width: '12%',
        render: state => (
          <Status
            type={state}
            name={t(`ALERT_RULE_${state.toUpperCase()}`, {
              defaultValue: state,
            })}
          />
        ),
      },
      {
        title: t('Alerting Type'),
        dataIndex: 'labels.severity',
        filters: this.getAlertingTypes(),
        filteredValue: getFilteredValue('labels.severity'),
        isHideable: true,
        search: true,
        width: '12%',
        render: severity => {
          const level = SEVERITY_LEVEL.find(item => item.value === severity)
          if (level) {
            return <Tag type={level.type}>{t(level.label)}</Tag>
          }
          return <Tag>{severity}</Tag>
        },
      },
      {
        title: t('Alerting Policy'),
        dataIndex: 'ruleName',
        isHideable: true,
        width: '12%',
        render: (ruleName, record) => (
          <Link
            to={
              this.state.type === 'builtin'
                ? `${this.getPrefix()}/alert-rules/builtin/${record.ruleId}`
                : `${this.getPrefix()}/alert-rules/${ruleName}`
            }
          >
            {ruleName}
          </Link>
        ),
      },
      {
        title: t('Alerting Resource'),
        dataIndex: 'labels',
        isHideable: true,
        width: '16%',
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
        title: t('Alert Active Time'),
        dataIndex: 'activeAt',
        isHideable: true,
        width: 200,
        render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]
  }

  renderCustomFilter() {
    const onReset = () => {
      this.table && this.table.clearFilter()
    }
    const onSearch = () => {
      const values = this.form.current.getFieldsValue()
      this.table && this.table.handleOutSearch(values)
    }
    const radioChange = (val, type) => {
      const values = this.form.current.getFieldsValue()
      this.table && this.table.handleOutSearch({ ...values, [type]: val })
    }

    return (
      <Form ref={this.form}>
        <Row justify="space-between" align="middle" className="margin-b12">
          <Row justify="space-between" gutter={15}>
            <Col>
              <Form.Item label="状态" name="state">
                <Radio.Group
                  defaultValue={''}
                  onChange={e => radioChange(e.target.value, 'state')}
                >
                  <Radio value={''}>全部</Radio>
                  <Radio value={'inactive'}>未触发</Radio>
                  <Radio value={'pending'}>待触发</Radio>
                  <Radio value={'firing'}>已触发</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="告警级别" name="labels.severity">
                <Radio.Group
                  defaultValue={''}
                  onChange={e => radioChange(e.target.value, 'labels.severity')}
                >
                  <Radio value={''}>全部</Radio>
                  <Radio value={'critical'}>危险</Radio>
                  <Radio value={'error'}>重要</Radio>
                  <Radio value={'warning'}>一般</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <KButton type="control" onClick={onSearch}>
                  搜索
                </KButton>
                <KButton type="default" onClick={onReset}>
                  清空
                </KButton>
              </Form.Item>
            </Col>
          </Row>
          <Col>
            <Form.Item>
              <KButton type="control" onClick={this.showCreate}>
                创建
              </KButton>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }

  render() {
    const { match, bannerProps, tableProps } = this.props
    const { namespace } = match.params
    return (
      <ListPage {...this.props} getData={this.getData} noWatch>
        <Banner
          {...bannerProps}
          // tips={this.tips}
          tabs={namespace ? {} : this.tabs}
          icon="loudspeaker"
          title={t('Alerting Messages')}
          description={t('ALERT_MESSAGE_DESC')}
        />
        <Table
          {...tableProps}
          onRef={node => {
            this.table = node
          }}
          hideSearch
          customFilter={this.renderCustomFilter()}
          formRef={this.form}
          {...this.getTableProps()}
          rowKey="id"
          itemActions={[]}
          columns={this.getColumns()}
          onCreate={this.showCreate}
        />
      </ListPage>
    )
  }
}
