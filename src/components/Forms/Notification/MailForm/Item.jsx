import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { Notify } from '@kube-design/components'
import { List } from 'components/Base'
import { BoxInput } from 'components/Inputs'
import { PATTERN_EMAIL } from 'utils/constants'

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

  validateMail = email => {
    const { value } = this.props
    const count = globals.config.notification.wecom['max_number_of_email']
    if (!email) {
      Notify.error({ content: t('Please input email'), duration: 1000 })
      return
    }
    if (value.length > count - 1) {
      Notify.error({
        content: t.html('MAX_EAMIL_COUNT', { count }),
        duration: 1000,
      })
      return
    }
    if (value.some(item => item.email === email)) {
      Notify.error({
        content: t('This email address has existed'),
        duration: 1000,
      })
      return
    }
    if (!PATTERN_EMAIL.test(email)) {
      Notify.error({ content: t('Invalid email'), duration: 1000 })
      return
    }
    return true
  }

  handleAdd = async email => {
    const { value, onChange } = this.props
    const results = await this.userStore.fetchList({ email })
    const newData = !isEmpty(results) ? results[0] : { email }
    onChange([...value, newData])
  }

  handleDelete = email => {
    const { value, onChange } = this.props
    const newData = value.filter(item => item.email !== email)
    onChange(newData)
  }

  render() {
    const { value } = this.props

    return (
      <div className={styles.wrapper}>
        <BoxInput
          placeholder={t('Please enter an email address')}
          validate={this.validateMail}
          onAdd={this.handleAdd}
        />
        {!isEmpty(value) && (
          <div className={styles.listWrapper}>
            <List>
              {value.map(item => (
                <List.Item
                  key={item.email}
                  icon="human"
                  title={`${item.email}${item.name ? `(${item.name})` : ''}`}
                  description={item.globalrole || '-'}
                  onDelete={() => this.handleDelete(item.email)}
                />
              ))}
            </List>
          </div>
        )}
      </div>
    )
  }
}
