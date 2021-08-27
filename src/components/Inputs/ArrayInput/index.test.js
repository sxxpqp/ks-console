import React from 'react'
import { mount } from 'enzyme'

import { Input } from '@kube-design/components'
import ArrayInput from './index'

it('renders correctly', () => {
  const defaultData = ['a', 'b']
  const onchangeCb = jest.fn()
  const wrapper = mount(
    <ArrayInput
      itemType="string"
      value={defaultData}
      onChange={onchangeCb}
      addText={t('Add Selector')}
    >
      <Input />
    </ArrayInput>
  )

  const items = wrapper.find('Item')
  expect(items).toHaveLength(2)
})

it('add correctly', () => {
  const defaultData = ['a', 'b']
  const onchangeCb = jest.fn()
  const wrapper = mount(
    <ArrayInput
      itemType="string"
      value={defaultData}
      onChange={onchangeCb}
      addText={t('Add Selector')}
    >
      <Input />
    </ArrayInput>
  )

  const addButton = wrapper.find('.text-right button').first()
  expect(addButton).toExist()
  addButton.simulate('click')
  expect(onchangeCb).toHaveBeenCalledWith(['a', 'b', ''])
})

it('change correctly', () => {
  const defaultData = ['a']
  const onchangeCb = jest.fn()
  const wrapper = mount(
    <ArrayInput
      itemType="string"
      value={defaultData}
      onChange={onchangeCb}
      addText={t('Add Selector')}
    >
      <Input />
    </ArrayInput>
  )

  const input = wrapper.find('Input').first()
  expect(input).toExist()
  input.prop('onChange')('b')
  expect(onchangeCb).toHaveBeenCalledWith(['b'])
})

it('delete correctly', () => {
  const defaultData = ['a']
  const onchangeCb = jest.fn()
  const wrapper = mount(
    <ArrayInput
      itemType="string"
      value={defaultData}
      onChange={onchangeCb}
      addText={t('Add Selector')}
    >
      <Input />
    </ArrayInput>
  )

  const deleteButton = wrapper.find('.delete').first()
  expect(deleteButton).toExist()
  deleteButton.simulate('click')
  expect(onchangeCb).toHaveBeenCalledWith([])
})
