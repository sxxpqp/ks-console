import React from 'react'
import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import Avatar from './index'

it('renders correctly', () => {
  const props = {
    avatar: '/assets/default-user.svg',
    title: 'Test',
    desc: 'test',
    to: '/test',
  }

  const wrapper = mount(
    <Router>
      <Avatar {...props} />
    </Router>
  )
  expect(wrapper).toIncludeText(props.title)
  expect(wrapper).toIncludeText(props.desc)
  expect(wrapper.find('img')).toHaveProp('src', props.avatar)
})

it('renders icon correctly', () => {
  const props = {
    icon: 'refresh',
    title: 'Test',
    desc: 'test',
    to: '/test',
  }

  const wrapper = mount(
    <Router>
      <Avatar {...props} />
    </Router>
  )
  expect(wrapper).toIncludeText(props.title)
  expect(wrapper).toIncludeText(props.desc)
  expect(wrapper.find('.kubed-icon-refresh')).toHaveLength(1)
})
