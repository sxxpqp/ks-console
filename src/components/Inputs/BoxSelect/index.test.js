import React from 'react'
import { mount } from 'enzyme'

import BoxSelect from './index'

it('renders correctly', () => {
  const options = [
    { value: 'a', icon: 'cdn', label: 'label-a' },
    { value: 'b', icon: 'cdn', label: 'label-b' },
  ]
  const onchangeCb = jest.fn()
  const wrapper = mount(<BoxSelect onChange={onchangeCb} options={options} />)

  const lists = wrapper.find('li')
  expect(lists).toHaveLength(2)
})

it('change correctly', () => {
  const options = [
    { value: 'a', icon: 'cdn', label: 'label-a' },
    { value: 'b', icon: 'cdn', label: 'label-b' },
  ]
  const onchangeCb = jest.fn()
  const wrapper = mount(<BoxSelect onChange={onchangeCb} options={options} />)

  const lists = wrapper.find('li')
  expect(lists).toHaveLength(2)
  lists.first().simulate('click')
  expect(onchangeCb).toHaveBeenCalledWith(['a'])
})
