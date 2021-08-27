import React from 'react'
import { mount } from 'enzyme'

import Banner from './index'

it('renders correctly', () => {
  const props = {
    type: 'dark',
    icon: '/assets/devops-white.svg',
    rightIcon: '/assets/banner-icon-2.svg',
    name: 'Test',
    desc: 'test',
  }

  const wrapper = mount(<Banner {...props} />)
  expect(wrapper).toIncludeText(props.name)
  expect(wrapper).toIncludeText(props.desc)
  expect(wrapper.find('img')).toHaveLength(2)
})
