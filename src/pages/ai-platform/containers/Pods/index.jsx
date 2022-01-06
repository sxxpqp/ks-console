import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, Button as KButton } from '@kube-design/components'

import { Indicator } from 'components/Base'
import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/List'
import { withProjectList, ListPage } from 'components/HOCs/withList'
import StatusReason from 'projects/components/StatusReason'

import { getLocalTime } from 'utils'
import { POD_STATUS, ICON_TYPES } from 'utils/constants'

import PodStore from 'stores/pod'
import { Form, Row, Col, Input } from 'antd'

import styles from './index.scss'

@withProjectList({
  store: new PodStore(),
  module: 'pods',
  name: 'Pod',
})
export default class Pods extends React.Component {
  constructor(props) {
    super(props)
    this.table = React.createRef()
    this.form = React.createRef()
  }

  componentDidMount() {
    localStorage.setItem('pod-detail-referrer', location.pathname)
  }

  get itemActions() {
    const { getData, trigger, name } = this.props
    return [
      {
        key: 'viewYaml',
        icon: 'eye',
        text: t('View YAML'),
        action: 'view',
        onClick: item =>
          trigger('resource.yaml.edit', {
            detail: item,
            readOnly: true,
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
            success: getData,
          }),
      },
    ]
  }

  getStatus() {
    return POD_STATUS.map(status => ({
      text: t(status.text),
      value: status.value,
    }))
  }

  getItemDesc = record => {
    const { status, type } = record.podStatus
    const desc =
      type !== 'running' && type !== 'completed' ? (
        <StatusReason
          status={type}
          reason={t(status)}
          data={record}
          type="pod"
        />
      ) : (
        t(type)
      )

    return desc
  }

  getColumns = () => {
    const { getSortOrder } = this.props
    return [
      {
        title: t('Name'),
        dataIndex: 'name',
        sorter: true,
        sortOrder: getSortOrder('name'),
        search: true,
        render: this.renderAvatar,
      },
      {
        title: t('Node'),
        dataIndex: 'node',
        isHideable: true,
        width: '18%',
        render: this.renderNode,
      },
      {
        title: t('Pod IP'),
        dataIndex: 'podIp',
        isHideable: true,
        width: '15%',
      },
      {
        title: t('Application'),
        dataIndex: 'app',
        isHideable: true,
        search: true,
        width: '15%',
      },
      {
        title: t('Updated Time'),
        dataIndex: 'startTime',
        sorter: true,
        sortOrder: getSortOrder('startTime'),
        isHideable: true,
        width: 150,
        render: time => getLocalTime(time).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]
  }

  renderAvatar = (name, record) => {
    const { module } = this.props
    const { workspace, cluster, namespace } = this.props.match.params
    const { podStatus } = record
    return (
      <div className={styles.avatar}>
        <div className={styles.icon}>
          <Icon name={ICON_TYPES[module]} size={40} />
          <Indicator
            className={styles.indicator}
            type={podStatus.type}
            flicker
          />
        </div>
        <div>
          <Link
            className={styles.title}
            to={{
              pathname: `/${workspace}/clusters/${cluster}/projects/${namespace}/${module}/${name}`,
              state: { prevPath: this.props.location.pathname },
            }}
          >
            {name}
          </Link>
          <div className={styles.desc}>{this.getItemDesc(record)}</div>
        </div>
      </div>
    )
  }

  renderNode = (_, record) => {
    const { cluster } = this.props.match.params
    const { node, nodeIp } = record

    if (!node) return '-'

    const text = `${node}(${nodeIp})`

    return <Link to={`/clusters/${cluster}/nodes/${node}`}>{text}</Link>
  }

  renderStatus = podStatus => (
    <Status type={podStatus.type} name={t(podStatus.type)} flicker />
  )

  renderCustomFilter() {
    const onReset = () => {
      this.table && this.table.clearFilter()
    }
    const onSearch = () => {
      const values = this.form.current.getFieldsValue()
      this.table && this.table.handleOutSearch(values)
    }

    return (
      <Form ref={this.form}>
        <Row justify="space-between" align="middle" className="margin-b12">
          <Row justify="space-between" gutter={15}>
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
              <Form.Item
                label="应用"
                name="app"
                style={{ width: '280px', marginRight: '10px' }}
              >
                <Input placeholder="请输入应用的名称" />
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
          {/* <Col>
            <Form.Item>
              <KButton type="control" onClick={this.showCreate}>
                创建
              </KButton>
            </Form.Item>
          </Col> */}
        </Row>
      </Form>
    )
  }

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props}>
        <Banner {...bannerProps} />
        <Table
          onRef={node => {
            this.table = node
          }}
          {...tableProps}
          hideSearch
          customFilter={this.renderCustomFilter()}
          itemActions={this.itemActions}
          columns={this.getColumns()}
          onCreate={null}
          formRef={this.form}
        />
      </ListPage>
    )
  }
}
