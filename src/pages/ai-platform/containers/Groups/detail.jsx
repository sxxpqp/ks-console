import React, { Component } from 'react'
import { Descriptions } from 'antd'

export default class Detail extends Component {
  render() {
    const { name, desc, code, pName, type } = this.props
    return (
      <Descriptions title="" bordered>
        <Descriptions.Item label="组织名称">{name}</Descriptions.Item>
        <Descriptions.Item label="简称">{desc || '未设置'}</Descriptions.Item>
        <Descriptions.Item label="编码">{code || '未设置'}</Descriptions.Item>
        <Descriptions.Item label="上级部门">
          {pName || '一级部门'}
        </Descriptions.Item>
        <Descriptions.Item label="类型" span={2}>
          {type === 0 ? '企业&组织' : '子部门'}
        </Descriptions.Item>
        {/* <Descriptions.Item label="排序">$60.00</Descriptions.Item> */}
      </Descriptions>
    )
  }
}
