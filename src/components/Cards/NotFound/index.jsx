import React from 'react'

import styles from './index.scss'

export default class NotFound extends React.Component {
  render() {
    const { title, link } = this.props
    return (
      <div className={styles.wrapper}>
        <img className={styles.image} src="/assets/empty-card.svg" alt="" />
        <div className={styles.text}>
          <div className="h1">Not Found</div>
          <p>{t.html('DETAIL_NOT_FOUND_DESC', { title, link })}</p>
        </div>
      </div>
    )
  }
}
