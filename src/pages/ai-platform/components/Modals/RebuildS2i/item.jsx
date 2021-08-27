import React from 'react'
import PropTypes from 'prop-types'

import { Radio } from '@kube-design/components'

import styles from './index.scss'

export default class Item extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: () => {},
    builderName: '',
    url: '',
  }

  constructor() {
    super()
    this.radio = React.createRef()
  }

  handleRadioClick = () => {
    this.radio.current.click()
  }

  render() {
    const { onChange, builderName, url, ...rest } = this.props

    return (
      <div className={styles.builderItem} onClick={this.handleRadioClick}>
        <Radio className={styles.radio} onChange={onChange} {...rest}>
          <p ref={this.radio} className={styles.title}>
            {builderName}
          </p>
        </Radio>
        <p className={styles.desc}>
          <span>{t('Repo URL')}:</span>
          {url}
        </p>
      </div>
    )
  }
}
