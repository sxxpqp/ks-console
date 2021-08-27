import React from 'react'
import { mount } from 'enzyme'

import Empty from './index'

it('renders correctly', () => {
  const props = {
    className: 'test',
  }

  const wrapper = mount(<Empty {...props} />)

  expect(wrapper.find('.test')).toExist()
})
