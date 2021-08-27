import React from 'react'
import PropTypes from 'prop-types'
import { Notify, Tag, Icon } from '@kube-design/components'
import { BoxInput } from 'components/Inputs'

import UserStore from 'stores/user'

import styles from './index.scss'

export default class Item extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    value: [],
    onChange() {},
  }

  userStore = new UserStore()

  validateChannel = channel => {
    const { value } = this.props
    const count = globals.config.notification.dingtalk['max_number_of_keyword']
    if (!channel) {
      Notify.error({ content: t('Please enter a channel'), duration: 1000 })
      return
    }
    if (value.length > count - 1) {
      Notify.error({
        content: t.html('MAX_CHANNEL_COUNT', { count }),
        durantion: 1000,
      })
      return
    }
    if (value.some(item => item === channel)) {
      Notify.error({ content: t('This channel has existed'), duration: 1000 })
      return
    }
    return true
  }

  handleAdd = channel => {
    const { value, onChange } = this.props
    onChange([...value, channel])
  }

  handleDelete = channel => {
    const { value, onChange } = this.props
    const newData = value.filter(item => item !== channel)
    onChange(newData)
  }

  render() {
    const { value } = this.props

    return (
      <div className={styles.wrapper}>
        <BoxInput
          placeholder={t('Please enter a channel')}
          onAdd={this.handleAdd}
          validate={this.validateChannel}
        />
        {value.length > 0 && (
          <div className="margin-t12">
            <p>{t('Channel Set')}</p>
            <div className={styles.listWrapper}>
              {value.map(item => {
                return (
                  <Tag className={styles.tag} type="primary" key={item}>
                    {item}
                    <Icon
                      name="close"
                      size={12}
                      clickable
                      onClick={() => this.handleDelete(item)}
                    ></Icon>
                  </Tag>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
}
