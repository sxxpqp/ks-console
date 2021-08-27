import React from 'react'
import { mount } from 'enzyme'

import Steps from './index'

it('renders correctly', () => {
  const steps = [
    { title: 'step1', component: <p>step1</p>, required: true },
    { title: 'step2', component: <p>step2</p>, required: true },
  ]
  const wrapper = mount(<Steps steps={steps} current={0} />)

  const lists = wrapper.find('ul li')
  expect(lists).toHaveLength(2)
  expect(lists.first().hasClass('current')).toEqual(true)
})
