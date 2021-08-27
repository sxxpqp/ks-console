import React from 'react'
import { mount } from 'enzyme'

import ReplicasInput from './index'

it('renders correctly', () => {
  const onchangeCb = jest.fn()
  const wrapper = mount(<ReplicasInput value={1} onChange={onchangeCb} />)

  expect(wrapper.find('.value').text()).toBe('1')
})

it('add correctly', () => {
  const onchangeCb = jest.fn()
  const wrapper = mount(<ReplicasInput value={1} onChange={onchangeCb} />)

  wrapper
    .find('.icon')
    .first()
    .simulate('click')
  expect(onchangeCb).toHaveBeenCalledWith(2)
})

it('subtract correctly', () => {
  const onchangeCb = jest.fn()
  const wrapper = mount(<ReplicasInput value={2} onChange={onchangeCb} />)

  wrapper
    .find('.icon')
    .last()
    .simulate('click')
  expect(onchangeCb).toHaveBeenCalledWith(1)
})
