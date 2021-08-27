import React, { Component } from 'react'
import { pick } from 'lodash'
import { Select, Form } from '@kube-design/components'

import NodeStore from 'stores/node'

export default class NodeSelect extends Component {
  store = new NodeStore()

  state = {
    node: [],
    isLoading: false,
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = params => {
    const { cluster } = this.props
    this.setState({ isLoading: false })
    this.store
      .fetchList({
        cluster,
        ...params,
      })
      .then(() => {
        this.setState({
          nodes: this.store.list.data.map(item => ({
            label: item.name,
            value: item.name,
          })),
          isLoading: false,
        })
      })
  }

  render() {
    const pagination = pick(this.store.list, ['page', 'limit', 'total'])
    return (
      <Form.Item
        label={t('Monitoring Target')}
        rules={[{ required: true, message: t('RESOURCE_NODE_FORM_TIP') }]}
      >
        <Select
          name="resources"
          options={this.state.nodes}
          pagination={pagination}
          isLoading={this.state.isLoading}
          onFetch={this.fetchData}
          searchable
          multi
        />
      </Form.Item>
    )
  }
}
