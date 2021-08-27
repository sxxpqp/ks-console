import React from 'react'
import { mount } from 'enzyme'
import styles from 'identity-obj-proxy'

import NumberInput from './index'

it('renders correctly', () => {
  const props = {
    value: '10%',
    onChange: jest.fn(),
    unit: '%',
  }
  const wrapper = mount(<NumberInput {...props} />)

  expect(wrapper.find('input')).toHaveProp({ value: '10' })

  wrapper.setProps({ showUnit: true })

  expect(wrapper.find(`.${styles.withUnit}`)).toExist()

  wrapper.find('input').simulate('change', { target: { value: '50' } })
  expect(props.onChange).toHaveBeenCalledWith('50%')

  wrapper.find('input').simulate('change', { target: { value: '00.aa' } })
  expect(props.onChange).toHaveBeenCalledWith('50%')

  wrapper.find('input').simulate('change', { target: { value: 'aa' } })
  expect(props.onChange).toHaveBeenCalledWith('50%')
})

it('renders with minmax', () => {
  const props = {
    value: 10,
    onChange: jest.fn(),
    min: 1,
    max: 30,
  }
  const wrapper = mount(<NumberInput {...props} />)

  expect(wrapper.find('input')).toHaveProp({ value: 10 })

  wrapper.find('input').simulate('change', { target: { value: '50' } })
  expect(props.onChange).toHaveBeenCalledWith(30)

  wrapper.find('input').simulate('change', { target: { value: '0' } })
  expect(props.onChange).toHaveBeenCalledWith(1)

  wrapper.find('input').simulate('change', { target: { value: '2.' } })
  expect(props.onChange).toHaveBeenCalledWith('2.')
})
