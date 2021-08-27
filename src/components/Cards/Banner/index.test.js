import React from 'react'
import { mount } from 'enzyme'
import { set } from 'lodash'
import styles from 'identity-obj-proxy'

import Banner from './index'

beforeAll(() => {
  set(globals, 'user.username', 'admin')
})

it('renders correctly', () => {
  const tips = [
    {
      title: 'SERVICE_TYPES_Q',
      description: 'SERVICE_TYPES_A',
    },
    {
      title: 'SCENARIOS_FOR_SERVICES_Q',
      description: 'SCENARIOS_FOR_SERVICES_A',
    },
  ]

  const handleTabChange = jest.fn()

  const tabs = {
    value: 'deployments',
    onChange: handleTabChange,
    options: [
      {
        value: 'deployments',
        label: 'Deployments',
        count: 10,
      },
      {
        value: 'statefulsets',
        label: 'StatefulSets',
        count: 8,
      },
      {
        value: 'daemonsets',
        label: 'DaemonSets',
        count: 2,
      },
    ],
  }

  const props = {
    title: 'Workloads',
    description: 'WORKLOAD_DESC',
    module: 'deployments',
    tips,
    tabs,
  }

  const wrapper = mount(<Banner {...props} />)
  expect(wrapper.find(`.${styles.title} .h3`)).toHaveText(props.title)
  expect(wrapper.find(`.${styles.title} .text-second`)).toIncludeText(
    props.description
  )
  expect(wrapper.find(`.${styles.tip}`)).toHaveLength(2)
  expect(wrapper.find(`.${styles.tabsWrapper} [type="radio"]`)).toHaveLength(3)

  wrapper
    .find(`.${styles.tabsWrapper} [type="radio"]`)
    .at(2)
    .prop('onChange')({
    target: { checked: true },
  })
  expect(handleTabChange).toHaveBeenCalledWith('daemonsets', undefined)
})
