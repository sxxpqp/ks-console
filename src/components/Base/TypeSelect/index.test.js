import React from 'react'
import { mount } from 'enzyme'
import styles from 'identity-obj-proxy'

import TypeSelect from './index'

it('renders correctly', () => {
  const options = [
    {
      icon: 'backup',
      value: 'stateful',
      label: 'Stateful Service',
      description: 'STATEFUL_SERVICE_DESC',
    },
    {
      icon: 'backup',
      value: 'stateless',
      label: 'Stateless Service',
      description: 'STATELESS_SERVICE_DESC',
    },
  ]

  const props = {
    value: 'stateful',
    onChange: jest.fn(),
    options,
  }

  const wrapper = mount(<TypeSelect {...props} />)
  expect(wrapper.find(`.${styles.control} .${styles.text} > div`)).toHaveText(
    'Stateful Service'
  )
  expect(wrapper.find(`.${styles.control} .${styles.text} > p`)).toHaveText(
    'STATEFUL_SERVICE_DESC'
  )
  expect(wrapper.find(`.${styles.options}`)).not.toExist()

  wrapper.setProps({ value: 'stateless' })
  expect(wrapper.find(`.${styles.control} .${styles.text} > div`)).toHaveText(
    'Stateless Service'
  )
  expect(wrapper.find(`.${styles.control} .${styles.text} > p`)).toHaveText(
    'STATELESS_SERVICE_DESC'
  )

  wrapper.find(`.${styles.control}`).simulate('click')
  expect(wrapper.find(`.${styles.options}`)).toExist()

  jest.useFakeTimers()

  wrapper
    .find(`.${styles.option}`)
    .at(0)
    .simulate('click')
  jest.advanceTimersByTime(200)
  expect(props.onChange).toHaveBeenCalled()
})
