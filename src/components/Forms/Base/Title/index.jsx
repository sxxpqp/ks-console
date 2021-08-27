import React from 'react'
import classnames from 'classnames'

import styles from './index.scss'

const Title = ({ title, desc, className }) => (
  <div className={classnames(styles.title, className)}>
    <div className="h4">{title}</div>
    <p>{desc}</p>
  </div>
)

export default Title
