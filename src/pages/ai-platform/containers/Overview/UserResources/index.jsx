import React, { Component } from 'react'
import { Panel } from 'components/Base'
import { Statistic, Row, Col } from 'antd'
import { observer, inject } from 'mobx-react'
import { Button as KButton } from '@kube-design/components'
import { Link } from 'react-router-dom'

@inject('rootStore')
@observer
export default class UserResources extends Component {
  render() {
    const { namespace, workspace, cluster } = this.props.rootStore.myClusters
    const url = `/${workspace}/clusters/${cluster}/projects/${namespace}/apply`

    const { countRes } = this.props
    return (
      <Panel title="申请资源统计">
        <Row>
          <Col span={6}>
            <Statistic
              title="CPU"
              value={`${countRes?.cpu || 0} vCore`}
              valueStyle={{ color: '#333' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="内存"
              value={`${countRes?.mem || 0} GiB`}
              valueStyle={{ color: '#333' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="磁盘"
              value={`${countRes?.disk || 0} GB`}
              valueStyle={{ color: '#333' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="GPU"
              value={`${countRes?.gpu || 0} vCore`}
              valueStyle={{ color: '#333' }}
            />
          </Col>
        </Row>
        <Row justify="end">
          <Link to={url}>
            <KButton type={'control'}>快速申请</KButton>
          </Link>
        </Row>
      </Panel>
    )
  }
}
