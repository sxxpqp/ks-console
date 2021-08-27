import React from 'react'
import { mount } from 'enzyme'

import BoolSelect from './index'

it('renders correctly', () => {
  const onchangeCb = jest.fn()
  const wrapper = mount(<BoolSelect onChange={onchangeCb} />)

  const select = wrapper.find('Select').first()
  expect(select).toExist()
  select.prop('onChange')({ target: { value: 'false' } })
  expect(onchangeCb).toHaveBeenCalledWith(false, undefined)
})
