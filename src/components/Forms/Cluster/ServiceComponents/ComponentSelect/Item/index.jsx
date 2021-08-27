import React, { Component } from 'react'
import classNames from 'classnames'
import { set, uniq, isEmpty } from 'lodash'
import { Text, Switch } from 'components/Base'
import { COMPONENT_ICON_MAP } from 'utils/constants'

import Params from '../Params'

import styles from './index.scss'

export default class Item extends Component {
  handleSwitch = enable => {
    const { data, value, onChange } = this.props

    let newValue
    if (enable) {
      const defaultValue = data.parameters
        .filter(item => 'default' in item && item.name !== 'enabled')
        .map(item => `${data.name}.${item.name}=${item.default}`)

      newValue = uniq([...value, `${data.name}.enabled=true`, ...defaultValue])
    } else {
      newValue = value.filter(item => !item.startsWith(data.name))
    }

    onChange(newValue)
  }

  handleParamsChange = data => {
    const { value, onChange } = this.props
    const prefix = this.props.data.name
    const newData = Object.keys(data).reduce(
      (prev, cur) => [...prev, `${prefix}.${cur}=${data[cur]}`],
      []
    )
    const newValue = uniq([
      ...value.filter(item => !item.startsWith(prefix)),
      ...newData,
    ])
    onChange(newValue)
  }

  renderParams() {
    const { data, value } = this.props

    const params = data.parameters.filter(item => item.name !== 'enabled')

    if (isEmpty(params)) {
      return null
    }

    const paramsValue = value
      .filter(item => item.startsWith(data.name))
      .reduce((prev, cur) => {
        const [key, _value] = cur.split('=')
        set(prev, key.replace(`${data.name}.`, ''), _value)
        return prev
      }, {})

    return (
      <div className="margin-b12">
        <Params
          data={params}
          value={paramsValue}
          onChange={this.handleParamsChange}
        />
      </div>
    )
  }

  render() {
    const { data, value } = this.props

    const showSwitch =
      data.parameters && data.parameters.some(item => item.name === 'enabled')

    if (!showSwitch) {
      return null
    }

    const enable = value.some(item => item === `${data.name}.enabled=true`)

    return (
      <>
        <div
          className={classNames(styles.item, {
            [styles.on]: enable || data.always,
          })}
        >
          <Text
            icon={COMPONENT_ICON_MAP[data.name] || 'apps'}
            title={t(data.title)}
            description={t(data.description)}
          />
          <Switch
            className={styles.switch}
            text={enable ? t('Enabled') : t('Disabled')}
            onChange={this.handleSwitch}
            checked={enable}
          />
        </div>
        {enable && this.renderParams()}
      </>
    )
  }
}
