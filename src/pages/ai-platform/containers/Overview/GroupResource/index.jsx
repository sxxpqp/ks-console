import React, { Component } from 'react'
import { Panel } from 'components/Base'
import { Statistic, Row, Col } from 'antd'
import { observer } from 'mobx-react'
import { getSum } from 'stores/ai-platform/review'

@observer
export default class GroupResource extends Component {
  // 获取组织的全部资源
  get groupResourceTotal() {
    const { groupRes } = this.props
    return getSum(groupRes)
  }

  // 组织资源使用情况
  get groupResourceUsedTotal() {
    const { groupRes } = this.props
    return getSum(groupRes, 1)
  }

  render() {
    return (
      <Panel title="组织资源">
        <Row style={{ paddingBottom: '10px' }}>总资源：</Row>
        <Row>
          <Col span={6}>
            <Statistic
              title="CPU"
              value={`${this.groupResourceTotal.cpu} Core`}
              valueStyle={{
                color: '#333',
                fontSize: '18px',
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="内存"
              value={`${this.groupResourceTotal.mem.toFixed(2)} GiB`}
              valueStyle={{
                color: '#333',
                fontSize: '18px',
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="磁盘"
              value={`${this.groupResourceTotal.disk.toFixed(2)} GB`}
              valueStyle={{
                color: '#333',
                fontSize: '18px',
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="GPU"
              value={`${this.groupResourceTotal.gpu} Core`}
              valueStyle={{
                color: '#333',
                fontSize: '18px',
              }}
            />
          </Col>
        </Row>
        <Row style={{ padding: '10px 0' }}>已使用资源：</Row>
        <Row>
          <Col span={6}>
            <Statistic
              title="CPU"
              value={`${this.groupResourceUsedTotal.cpu_used.toFixed(2)} Core`}
              valueStyle={{
                color: '#333',
                fontSize: '18px',
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="内存"
              value={`${this.groupResourceUsedTotal.mem_used.toFixed(2)} GiB`}
              valueStyle={{
                color: '#333',
                fontSize: '18px',
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="磁盘"
              value={`${this.groupResourceUsedTotal.disk_used.toFixed(2)} GB`}
              valueStyle={{
                color: '#333',
                fontSize: '18px',
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="GPU"
              value={`${this.groupResourceUsedTotal.gpu_used.toFixed(2)} Core`}
              valueStyle={{
                color: '#333',
                fontSize: '18px',
              }}
            />
          </Col>
        </Row>
      </Panel>
    )
  }
}
