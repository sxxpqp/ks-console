import React from 'react'
import { mount } from 'enzyme'

import { Input } from '@kube-design/components'
import ObjectInput from './index'

it('renders correctly', () => {
  const defaultData = {
    a: 'a',
  }
  const onchangeCb = jest.fn()
  const wrapper = mount(
    <ObjectInput onChange={onchangeCb} value={defaultData}>
      <Input name="key" placeholder={t('key')} />
      <Input name="value" rows="1" placeholder={t('value')} />
    </ObjectInput>
  )

  const items = wrapper.find('Input')
  expect(items).toHaveLength(2)
})

it('change correctly', () => {
  const defaultData = {
    a: 'a',
  }
  const onchangeCb = jest.fn()
  const wrapper = mount(
    <ObjectInput onChange={onchangeCb} value={defaultData}>
      <Input name="key" placeholder={t('key')} />
      <Input name="value" rows="1" placeholder={t('value')} />
    </ObjectInput>
  )

  const keyInput = wrapper.find('Input').first()
  expect(keyInput).toExist()
  keyInput.prop('onChange')({ currentTarget: { value: 'key' } })
  expect(onchangeCb).toHaveBeenCalledWith({ a: 'a', key: 'key', value: '' })
})
