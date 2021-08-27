import React from 'react'
import { mount } from 'enzyme'
import styles from 'identity-obj-proxy'

import List from './index'

it('renders correctly', () => {
  const value = {
    key1: 'data1',
    key2: 'data2',
  }

  const onAdd = jest.fn()
  const onDelete = jest.fn()
  const onEdit = jest.fn()

  const wrapper = mount(
    <List>
      {Object.entries(value).map(([key, _value]) => (
        <List.Item
          key={key}
          icon="key"
          title={key}
          description={_value || '-'}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
      <List.Add
        title={'Add Data'}
        description={'Add key / value pair data'}
        onClick={onAdd}
      />
    </List>
  )
  expect(wrapper).toIncludeText('key1')
  expect(wrapper).toIncludeText('key2')
  expect(wrapper).toIncludeText('data1')
  expect(wrapper).toIncludeText('data2')

  wrapper
    .find('button')
    .first()
    .simulate('click')
  expect(onDelete).toHaveBeenCalled()

  wrapper
    .find('button')
    .at(1)
    .simulate('click')
  expect(onEdit).toHaveBeenCalled()

  wrapper.find(`.${styles.add}`).simulate('click')
  expect(onAdd).toHaveBeenCalled()
})
