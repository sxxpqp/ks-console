import React from 'react'
import { mount } from 'enzyme'

import RadioGroup from './index'

it('renders correctly', () => {
  const options = [
    {
      value: 'value1',
      label: 'Label1',
      count: 10,
    },
    {
      value: 'value2',
      label: 'Label2',
      count: 12,
    },
  ]

  const props = {
    value: 'value1',
    onChange: jest.fn(),
    options,
  }

  const wrapper = mount(<RadioGroup {...props} />)
  expect(wrapper).toIncludeText('Label1')
  expect(wrapper).toIncludeText('Label2')
  expect(wrapper.find('[type="radio"][value="value1"]')).toHaveProp(
    'checked',
    true
  )
  expect(wrapper.find('[type="radio"][value="value2"]')).not.toHaveProp(
    'checked',
    true
  )

  wrapper.setProps({
    value: 'value2',
  })
  expect(wrapper.find('[type="radio"][value="value1"]')).not.toHaveProp(
    'checked',
    true
  )
  expect(wrapper.find('[type="radio"][value="value2"]')).toHaveProp(
    'checked',
    true
  )
})
