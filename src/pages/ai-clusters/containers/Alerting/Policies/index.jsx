import React from 'react'
import { get } from 'lodash'

import { Tag, Button as KButton } from '@kube-design/components'
import { Avatar, Status } from 'components/Base'
import Banner from 'components/Cards/Banner'
import withList, { ListPage } from 'components/HOCs/withList'

import Table from 'components/Tables/List'

import { getLocalTime, getDisplayName } from 'utils'
import { ALERTING_STATUS } from 'utils/alerting'
import { SEVERITY_LEVEL } from 'configs/alerting/metrics/rule.config'

import PolicyStore from 'stores/alerting/policy'
import {
  // Popover,
  Form,
  Row,
  Col,
  Input,
  Radio,
} from 'antd'

@withList({
  store: new PolicyStore(),
  module: 'rules',
  authKey: 'alert-rules',
  name: 'Alerting Policy',
})
export default class AlertingPolicy extends React.Component {
  constructor(props) {
    super(props)
    this.form = React.createRef()
    this.table = React.createRef()
    this.onCreate = null
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

  getData = async ({ silent, ...params } = {}) => {
    const store = this.props.store

    silent && (store.list.silent = true)
    await store.fetchList({
      ...this.props.match.params,
      ...params,
      type: this.state.type,
    })
    store.list.silent = false
  }

  // get tips() {
  //   return [
  //     {
  //       title: t('REQUESTS_FOR_PUSH_AN_ALARM_Q'),
  //       description: t('REQUESTS_FOR_PUSH_AN_ALARM_A'),
  //     },
  //     {
  //       title: t('HOW_TO_SUPRESS_AN_ALARM_Q'),
  //       description: t('HOW_TO_SUPRESS_AN_ALARM_A'),
  //     },
  //   ]
  // }

  get itemActions() {
    const { trigger, routing, match, getData, module, name } = this.props
    return [
      {
        key: 'edit',
        icon: 'pen',
        text: t('Edit'),
        action: 'edit',
        onClick: item =>
          trigger('alerting.policy.create', {
            detail: item,
            module,
            cluster: match.params.cluster,
            namespace: match.params.namespace,
            title: `${t('Edit ')}${t('alerting policy')}`,
            success: getData,
          }),
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('Delete'),
        action: 'delete',
        onClick: item =>
          trigger('resource.delete', {
            type: t(name),
            detail: item,
            success: routing.query,
          }),
      },
    ]
  }

  getStatus() {
    return ALERTING_STATUS.map(status => ({
      text: t(`ALERT_RULE_${status.toUpperCase()}`),
      value: status,
    }))
  }

  getAlertingTypes() {
    return SEVERITY_LEVEL.map(level => ({
      text: t(level.label),
      value: level.value,
    }))
  }

  getColumns = () => {
    const { getFilteredValue } = this.props
    return [
      {
        title: t('Name'),
        dataIndex: 'name',
        search: true,
        render: (name, record) => (
          <Avatar
            icon="wrench"
            title={getDisplayName(record)}
            desc={record.desc}
            to={
              this.state.type === 'builtin'
                ? `${this.props.match.url}/builtin/${record.id}`
                : `${this.props.match.url}/${name}`
            }
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
        width: '16%',
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
        width: '16%',
        render: severity => {
          const level = SEVERITY_LEVEL.find(item => item.value === severity)
          if (level) {
            return <Tag type={level.type}>{t(level.label)}</Tag>
          }
          return <Tag>{severity}</Tag>
        },
      },
      {
        title: t('Alert Active Time'),
        dataIndex: 'alerts',
        isHideable: true,
        width: '16%',
        render: (alerts = []) => {
          const time = get(alerts, `${alerts.length - 1}.activeAt`)
          return time ? getLocalTime(time).format('YYYY-MM-DD HH:mm:ss') : '-'
        },
      },
    ]
  }

  showCreate = () => {
    const { match, getData, module } = this.props
    return this.props.trigger('alerting.policy.create', {
      module,
      cluster: match.params.cluster,
      namespace: match.params.namespace,
      title: `${t('Add ')}${t('alerting policy')}`,
      success: getData,
    })
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
          </Row>
          <Col>
            <Form.Item>
              <KButton type="control" onClick={this.showCreate}>
                创建
              </KButton>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Item
              label="名称"
              name="name"
              style={{ width: '280px', marginRight: '10px' }}
            >
              <Input placeholder="请输入名称" />
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
      </Form>
    )
  }

  render() {
    const { bannerProps, tableProps, match } = this.props
    const { namespace } = match.params

    let rowKey = 'name'
    let itemActions = this.itemActions
    this.onCreate = this.showCreate
    if (this.state.type === 'builtin') {
      tableProps.selectActions = []
      itemActions = []
      this.onCreate = null
      rowKey = 'id'
    }

    return (
      <ListPage {...this.props} getData={this.getData} noWatch>
        <Banner
          {...bannerProps}
          // tips={this.tips}
          tabs={namespace ? {} : this.tabs}
          title={t('Alerting Policies')}
          description={t('ALERT_POLICY_DESC')}
        />
        <Table
          onRef={node => {
            this.table = node
          }}
          {...tableProps}
          hideSearch
          customFilter={this.renderCustomFilter()}
          rowKey={rowKey}
          itemActions={itemActions}
          columns={this.getColumns()}
          onCreate={this.onCreate}
          formRef={this.form}
        />
      </ListPage>
    )
  }
}
