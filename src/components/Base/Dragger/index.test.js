import React from 'react'
import { mount } from 'enzyme'
import Dragger from './index'

jest.useFakeTimers()

it('renders correctly', () => {
  const wrapper = mount(
    <Dragger
      style={{ height: '800px', width: '800px' }}
      initialScale={0.5}
      class="container"
      contentClassName="content"
    >
      <div />
    </Dragger>
  )

  return Promise.resolve(wrapper)
    .then(() => wrapper.update())
    .then(() => {
      const content = wrapper.find('.main_content').first()
      expect(wrapper.find('.container')).toExist()
      expect(content).toExist()
      expect(
        getComputedStyle(content.getDOMNode()).getPropertyValue(`transform`)
      ).toEqual(expect.stringContaining('scale(0.5)'))
    })
})

it('scale correctly', () => {
  const wrapper = mount(
    <Dragger initialScale={0.5} class="container" contentClassName="content">
      <div />
    </Dragger>
  )

  return Promise.resolve(wrapper)
    .then(() => wrapper.update())
    .then(() => {
      wrapper
        .find('.kubed-icon-substract')
        .first()
        .simulate('click')
      const content = wrapper.find('.main_content').first()
      expect(content).toExist()
      expect(
        getComputedStyle(content.getDOMNode()).getPropertyValue(`transform`)
      ).toEqual(expect.stringContaining('scale(0.3)'))
    })
})

it('mouseWheel change correctly', () => {
  const wrapper = mount(
    <Dragger initialScale={0.5} class="container" contentClassName="content">
      <div style={{ height: '200px', width: '200px' }} />
    </Dragger>
  )

  return Promise.resolve(wrapper)
    .then(() => wrapper.update())
    .then(() => {
      const content = wrapper.find('.main_content').first()
      const container = wrapper.find('.container').first()
      expect(content).toExist()
      expect(container).toExist()

      wrapper.instance().handleWheel({
        clientX: 0,
        clientY: 0,
        deltaY: 4,
        preventDefault: () => {},
        stopPropagation: () => {},
      })
      expect(
        getComputedStyle(content.getDOMNode()).getPropertyValue(`transform`)
      ).toEqual(expect.stringContaining('scale(0.46)'))
    })
})

it('move correctly', () => {
  const wrapper = mount(
    <Dragger initialScale={0.5} class="container" contentClassName="content">
      <div style={{ height: '200px', width: '200px' }} />
    </Dragger>
  )

  return Promise.resolve(wrapper)
    .then(() => wrapper.update())
    .then(() => {
      const content = wrapper.find('.main_content').first()
      const container = wrapper.find('.container').first()
      expect(content).toExist()
      expect(container).toExist()

      container.simulate('mouseDown', { button: 0, clientX: 0, clientY: 0 })
      container.simulate('mouseMove', { clientX: 0, clientY: 0 })
      container.simulate('mouseMove', { clientX: 10, clientY: 10 })
      container.simulate('mouseUp', { clientX: 10, clientY: 10 })
      expect(
        getComputedStyle(content.getDOMNode()).getPropertyValue(`transform`)
      ).toEqual(expect.stringContaining('translate3d(10px, 10px, 0)'))
    })
})
