import React from 'react'
import { mount } from 'enzyme'
import styles from 'identity-obj-proxy'

import ScrollLoad from './index'

const data = Array(20)
  .fill('')
  .map((item, index) => ({
    label: `label-${index}`,
    value: `value-${index}`,
  }))

it('renders correctly', () => {
  const props = {
    data: data.slice(0, 10),
    total: data.length,
    page: 1,
    loading: false,
    onFetch: jest.fn(),
  }

  const wrapper = mount(
    <ScrollLoad {...props}>
      {data.map(item => (
        <div key={item.value}>{item.label}</div>
      ))}
    </ScrollLoad>
  )

  expect(props.onFetch).toHaveBeenCalledTimes(1)

  wrapper.find(`.${styles.main}`).prop('onScrollCapture')()

  expect(props.onFetch).toHaveBeenCalledWith({
    more: true,
    page: 2,
  })
})

it('props update', () => {
  const props = {
    data: data.slice(0, 10),
    total: 10,
    page: 1,
    loading: false,
    onFetch: jest.fn(),
  }

  const wrapper = mount(
    <ScrollLoad {...props}>
      {data.map(item => (
        <div key={item.value}>{item.label}</div>
      ))}
    </ScrollLoad>
  )

  expect(props.onFetch).toHaveBeenCalledTimes(1)

  wrapper.setProps({ loading: true })
  expect(wrapper.find(styles.main)).not.toExist()

  wrapper.setProps({ loading: false })

  wrapper.find(`.${styles.main}`).prop('onScrollCapture')()
  expect(props.onFetch).toHaveBeenCalledTimes(1)
})

it('empty holder', () => {
  const props = {
    data: [],
    total: 0,
    page: 1,
    loading: false,
    onFetch: jest.fn(),
  }

  const wrapper = mount(
    <ScrollLoad {...props}>
      {data.map(item => (
        <div key={item.value}>{item.label}</div>
      ))}
    </ScrollLoad>
  )

  expect(wrapper).toHaveText('No Data')
})
