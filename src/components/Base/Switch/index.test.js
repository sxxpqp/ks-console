import React from 'react'
import { mount } from 'enzyme'

import Switch from './index'

it('renders correctly', () => {
  const handleChange = jest.fn()
  const wrapper = mount(
    <Switch text={t('Edit Mode')} onChange={handleChange} checked={true} />
  )

  const button = wrapper.find('button')
  expect(button).toExist()
})

it('submit correctly', () => {
  const handleChange = jest.fn()
  const data = true
  const wrapper = mount(
    <Switch text={t('Edit Mode')} onChange={handleChange} checked={data} />
  )

  const button = wrapper.find('button')
  expect(button).toExist()
  button.simulate('click')
  expect(handleChange).toHaveBeenCalledWith(!data)
})
