import React from 'react'
import { mount } from 'enzyme'

import S2IEnviroment from './index'

it('renders correctly', () => {
  const defaultData = [
    { key: 'a', defaultValue: 'a', type: 'string' },
    { key: 'b', defaultValue: 'b', type: 'boolean' },
  ]
  const onchangeCb = jest.fn()
  const wrapper = mount(
    <S2IEnviroment
      value={[
        { name: 'a', value: 'a' },
        { name: 'b', value: 'b' },
      ]}
      options={defaultData}
      onChange={onchangeCb}
    />
  )

  const items = wrapper.find('Item')
  expect(items).toHaveLength(2)
})

it('add correctly', () => {
  const defaultData = [
    { key: 'a', defaultValue: 'a', type: 'string' },
    { key: 'b', defaultValue: 'b', type: 'boolean' },
  ]
  const onchangeCb = jest.fn()
  const wrapper = mount(
    <S2IEnviroment
      value={[
        { name: 'a', value: 'a' },
        { name: 'b', value: 'b' },
      ]}
      options={defaultData}
      onChange={onchangeCb}
    />
  )

  const addButton = wrapper.find('.text-right button').first()
  expect(addButton).toExist()
  addButton.simulate('click')
  expect(onchangeCb).toHaveBeenCalledWith([
    { name: 'a', value: 'a' },
    { name: 'b', value: 'b' },
    '',
  ])
})

it('change correctly', () => {
  const defaultData = [
    { key: 'a', defaultValue: 'a', type: 'string' },
    { key: 'b', defaultValue: 'b', type: 'boolean' },
  ]
  const onchangeCb = jest.fn()
  const wrapper = mount(
    <S2IEnviroment
      value={[{ name: 'a', value: 'a' }]}
      options={defaultData}
      onChange={onchangeCb}
    />
  )

  const input = wrapper.find('Select').first()
  expect(input).toExist()
  input.prop('onChange')('b')
  expect(onchangeCb).toHaveBeenCalledWith([{ name: 'b', value: 'b' }])
})
