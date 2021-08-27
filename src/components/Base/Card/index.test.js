import React from 'react'
import { mount } from 'enzyme'
import styles from 'identity-obj-proxy'

import Card from './index'

it('renders correctly', () => {
  const props = {
    title: 'Test',
    operations: 'test operations',
  }

  const wrapper = mount(<Card {...props}>Children</Card>)
  expect(wrapper).toIncludeText(props.title)
  expect(wrapper).toIncludeText('Children')
  expect(wrapper.find(`.${styles.default}`)).toHaveLength(1)
  expect(wrapper.find(`.${styles.operations}`)).toHaveLength(1)

  wrapper.setProps({ loading: true })
  expect(wrapper.find(`.${styles.loading}`)).toExist()

  wrapper.setProps({ loading: false, empty: 'test empty' })
  expect(wrapper.find(`.${styles.loading}`)).toHaveLength(0)
  expect(wrapper.find(`.${styles.empty}`)).toHaveLength(0)

  wrapper.setProps({ isEmpty: true })
  expect(wrapper.find(`.${styles.empty}`)).toHaveLength(1)
})
