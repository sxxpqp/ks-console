import React from 'react'
import { get, unset } from 'lodash'

import { Button, Form } from '@kube-design/components'
import { QUOTAS_MAP } from 'utils/constants'

import QuotaItem from './Item'

import { RESERVED_MODULES, QUOTAS_KEY_MODULE_MAP } from './constants'

import styles from './index.scss'

export default class Quotas extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      items: [{ module: 'pods' }, ...this.getItems(props)],
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        items: [{ module: 'pods' }, ...this.getItems(this.props)],
      })
    }
  }

  getItems(props) {
    return Object.keys(get(props.data, 'spec.hard', {}))
      .map(key => ({ module: QUOTAS_KEY_MODULE_MAP[key] }))
      .filter(
        ({ module }) => !RESERVED_MODULES.includes(module) && module !== 'pods'
      )
  }

  handleAddQuotaItem = () => {
    this.setState(({ items }) => ({
      items: [...items, { module: '' }],
    }))
  }

  handleItemModuleChange = (newModule, module) => {
    this.setState(
      ({ items }) => ({
        items: items.map(item => {
          if (item.module === module) {
            item.module = newModule
          }
          return { ...item }
        }),
      }),
      () => {
        unset(
          this.props.data,
          `spec.hard["${get(QUOTAS_MAP, `[${module}].name`)}"]`
        )
      }
    )
  }

  handleItemModuleDelete = module => {
    this.setState(
      ({ items }) => ({
        items: items.filter(item => item.module !== module),
      }),
      () => {
        unset(
          this.props.data,
          `spec.hard["${get(QUOTAS_MAP, `[${module}].name`)}"]`
        )
      }
    )
  }

  render() {
    const filterModules = this.state.items.map(_item => _item.module)
    const disableAdd = this.state.items.some(item => item.module === '')

    return (
      <div className={styles.wrapper}>
        {this.state.items.map(item => (
          <Form.Item key={item.module}>
            <QuotaItem
              name={`spec.hard["${get(QUOTAS_MAP, `[${item.module}].name`)}"]`}
              module={item.module}
              onModuleChange={this.handleItemModuleChange}
              onModuleDelete={this.handleItemModuleDelete}
              filterModules={filterModules}
              disableSelect={item.module === 'pods'}
              isFederated={this.props.isFederated}
            />
          </Form.Item>
        ))}
        <div className={styles.add}>
          <Button onClick={this.handleAddQuotaItem} disabled={disableAdd}>
            {t('Add Quota Item')}
          </Button>
        </div>
      </div>
    )
  }
}
