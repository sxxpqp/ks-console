import React, { Component } from 'react'
import { get } from 'lodash'

import { Form } from '@kube-design/components'
import { TypeSelect } from 'components/Base'

export default class PodAffinity extends Component {
  get replicasPolicyOptions() {
    const matchLabels = get(
      this.props.template,
      'spec.template.metadata.labels',
      {}
    )

    const affinity = {
      preferredDuringSchedulingIgnoredDuringExecution: [
        {
          weight: 100,
          podAffinityTerm: {
            labelSelector: {
              matchLabels,
            },
            topologyKey: 'kubernetes.io/hostname',
          },
        },
      ],
    }

    return [
      {
        uid: 'default',
        label: t('Pod Default Deployment'),
        value: {},
        description: t(
          'Pod replicas will be deployed according to the default policy.'
        ),
      },
      {
        uid: 'decentralized',
        label: t('Pod Decentralized Deployment'),
        value: {
          podAntiAffinity: affinity,
        },
        description: t(
          'Pod replicas will be deployed on different nodes as much as possible.'
        ),
      },
      {
        uid: 'aggregation',
        label: t('Pod Aggregation Deployment'),
        value: {
          podAffinity: affinity,
        },
        description: t(
          'Pod replicas will be deployed on the same node as much as possible.'
        ),
      },
    ]
  }

  render() {
    const options = this.replicasPolicyOptions
    return (
      <Form.Item label={t('Deployment Mode')}>
        <TypeSelect
          name="spec.template.spec.affinity"
          options={options}
          defaultValue={options[0].value}
        />
      </Form.Item>
    )
  }
}
