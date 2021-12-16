import React, { Component } from 'react'
import { Panel } from 'components/Base'
import { Row, Col, Button, Table, Tag } from 'antd'
import { observer, inject } from 'mobx-react'
import { Icon } from '@kube-design/components'
import ReactECharts from 'echarts-for-react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
// import { EyeOutlined } from '@ant-design/icons'
import styles from './index.scss'

@observer
@inject('rootStore')
export default class MyApps extends Component {
  constructor(props) {
    super(props)
    this.store = this.props.store
    this.echartRef = React.createRef()
  }

  get prefix() {
    const { workspace, cluster, namespace } = globals.user.ai
    return `/${workspace}/clusters/${cluster}/projects/${namespace}/applications/`
  }

  get routing() {
    return this.props.rootStore.routing
  }

  // 查看应用详情
  handleDetail = record => {
    const { history } = this.routing
    const type = record.type ? 'composing' : 'template'
    history.push({
      pathname: `${this.prefix}${type}/${record.appId}`,
      state: {
        prevPath: location.pathname,
      },
    })
  }

  handleClick = item => {
    const { workspace, namespace, cluster } = globals.user.ai
    this.routing.push(
      `/${workspace}/clusters/${cluster}/projects/${namespace}/${item}`
    )
    // this.routing.push(
    //   workspace
    //     ? `/${workspace}/clusters/${cluster}/projects/${namespace}/${routeName}`
    //     : `/clusters/${cluster}/${routeName}?namespace=${namespace}`
    // )
  }

  getColumns() {
    return [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render: (_, record) => (
          <Button type="link" onClick={() => this.handleDetail(record)}>
            {_}
          </Button>
        ),
      },
      {
        title: '分类',
        dataIndex: 'type',
        render: type =>
          type === 0 ? (
            <Tag color="processing">模板</Tag>
          ) : (
            <Tag color="success">自制</Tag>
          ),
      },
      {
        title: '消息',
        dataIndex: '_msg',
        key: '_msg',
        render: val => val || '已停止',
      },
      {
        title: '创建时间',
        dataIndex: 'created',
        width: '210px',
        render: created => dayjs(created).format('YYYY-MM-DD HH:mm:ss'),
      },
      // {
      //   title: '操作',
      //   key: 'more',
      //   render: (_, record) => (
      //     <div className={styles.btns}>
      //       <Button
      //         type="text"
      //         size="small"
      //         icon={<EyeOutlined />}
      //         onClick={() => this.handleDetail(record)}
      //       >
      //         详情
      //       </Button>
      //     </div>
      //   ),
      // },
    ]
  }

  getOptions() {
    const { total, totalFail } = this.store
    return {
      title: {
        text: '运行应用统计',
        // subtext: 'Fake Data',
      },
      tooltip: {
        trigger: 'item',
      },
      color: ['#389e0d', '#f5222d'],
      legend: {
        orient: 'horizontal',
        bottom: '0',
      },
      series: [
        {
          name: '应用数量',
          type: 'pie',
          radius: '50%',
          data: [
            { value: total - totalFail, name: '正常' },
            { value: totalFail, name: '异常' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
  }

  renderEmpty() {
    return (
      <div className={styles.empty}>
        <Icon name="backup" size={32} />
        <div>{t('No Relevant Data')}</div>
      </div>
    )
  }

  render() {
    const { lists, store } = this.props
    const { namespace, workspace, cluster } = this.props.rootStore.myClusters
    const url = `/${workspace}/clusters/${cluster}/projects/${namespace}/applications`
    return (
      <Panel title="运行容器统计">
        {lists ? (
          <Row>
            <Col span={8}>
              <ReactECharts
                ref={e => {
                  this.echartRef = e
                }}
                option={this.getOptions()}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={16}>
              <Row>运行异常</Row>
              <div className="margin-b12">
                <Table
                  id="appId"
                  dataSource={lists}
                  columns={this.getColumns()}
                  pagination={{
                    defaultCurrent: 1,
                    defaultPageSize: 5,
                    total: store.abnormalAppTotal,
                    simple: true,
                  }}
                />
              </div>
              <Row justify="end">
                <Link to={url}>
                  <Button type="link">查看更多</Button>
                </Link>
              </Row>
            </Col>
          </Row>
        ) : (
          this.renderEmpty()
        )}
      </Panel>
    )
  }
}
