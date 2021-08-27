import React from 'react'
import { mount } from 'enzyme'
import styles from 'identity-obj-proxy'

import Modal from './index'

it('renders correctly', () => {
  const props = {
    icon: 'pen',
    title: 'modal title',
    description: 'modal description',
    visible: true,
    onOk: jest.fn(),
    onCancel: jest.fn(),
  }

  const wrapper = mount(<Modal {...props}>Checkbox</Modal>)
  expect(
    wrapper.find(`.${styles.title} .${styles.text} > div`).first()
  ).toHaveText(props.title)
  expect(
    wrapper.find(`.${styles.title} .${styles.text} > div`).last()
  ).toHaveText(props.description)
  expect(wrapper.find(`.${styles.body}`)).toHaveText('Checkbox')

  wrapper
    .find(`.${styles.footer} button`)
    .first()
    .simulate('click')
  expect(props.onCancel).toHaveBeenCalled()

  wrapper
    .find(`.${styles.footer} button`)
    .last()
    .simulate('click')
  expect(props.onCancel).toHaveBeenCalled()
})
