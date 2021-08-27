import React from 'react'
import PropTypes from 'prop-types'
import { Toggle } from '@kube-design/components'
import Text from '../Text'

import styles from './index.scss'

export default class CheckableText extends React.PureComponent {
  static propTypes = {
    value: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange() {},
  }

  handleChange = () => {
    const { value, onChange } = this.props
    onChange(!value)
  }

  render() {
    const { value, title, description } = this.props
    return (
      <div className={styles.wrapper} onClick={this.handleChange}>
        <Toggle checked={value} />
        <Text className={styles.text} title={title} description={description} />
      </div>
    )
  }
}
