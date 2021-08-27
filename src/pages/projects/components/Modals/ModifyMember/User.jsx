import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.scss'

export default class UserItem extends React.Component {
  static propTypes = {
    user: PropTypes.object,
  }

  render() {
    const { user } = this.props

    return (
      <div className={styles.item}>
        <p>
          <strong>{user.username}</strong>
        </p>
        <p>{user.email}</p>
      </div>
    )
  }
}
