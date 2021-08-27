import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { get, isEmpty } from 'lodash'
import { Form } from '@kube-design/components'
import { TypeSelect } from 'components/Base'
import IPPoolStore from 'stores/network/ippool'

@observer
export default class PodIPRange extends Component {
  store = new IPPoolStore()

  componentDidMount() {
    const { cluster, namespace } = this.props
    this.store.fetchList({ cluster, namespace, limit: -1 })
  }

  get prefix() {
    return this.props.prefix || 'spec.template.'
  }

  get options() {
    return this.store.list.data
      .filter(item => get(item, 'status.unallocated', 0))
      .map(item => ({
        label: item.name,
        value: JSON.stringify([item.name]),
        icon: 'eip-group',
        description: item.description || '-',
        details: [
          {
            label: item.cidr,
            description: t('IP/Mask Bit'),
          },
          {
            label: get(item, 'status.unallocated'),
            description: t('Available Number'),
          },
        ],
      }))
  }

  render() {
    const options = this.options

    if (isEmpty(options)) {
      return null
    }

    return (
      <Form.Item label={t('Pod IP Range')}>
        <TypeSelect
          name={`${this.prefix}metadata.annotations["cni.projectcalico.org/ipv4pools"]`}
          options={options}
          defaultValue={options[0].value}
        />
      </Form.Item>
    )
  }
}
