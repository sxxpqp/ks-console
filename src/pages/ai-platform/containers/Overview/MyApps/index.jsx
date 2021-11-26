import React, { Component } from 'react'
import { Panel } from 'components/Base'
import { Row, Col, Button, Table } from 'antd'
import { observer, inject } from 'mobx-react'
import { Icon } from '@kube-design/components'
import ReactECharts from 'echarts-for-react'
import { Link } from 'react-router-dom'
import styles from './index.scss'

@observer
@inject('rootStore')
export default class MyApps extends Component {
  constructor(props) {
    super(props)
    this.store = this.props.store
    this.echartRef = React.createRef()
  }

  handleClick = item => {
    const { workspace, namespace, cluster } = this.props.match.params
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
        title: '应用',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '异常分类',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '消息',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '时间',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '操作',
        dataIndex: 'address',
        key: 'address',
      },
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
    const { lists } = this.props
    const { namespace, workspace, cluster } = this.props.rootStore.myClusters
    const url = `/${workspace}/clusters/${cluster}/projects/${namespace}/applications/template`
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
                <Table dataSource={[]} columns={this.getColumns()} />
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
