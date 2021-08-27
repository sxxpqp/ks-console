import { isEmpty } from 'lodash'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Button } from '@kube-design/components'
import styles from './index.scss'

export default class Switch extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    text: PropTypes.string,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    type: 'primary',
    checked: false,
    onChange: () => {},
  }

  toggleSwitch = () => {
    const { checked, onChange } = this.props
    onChange(!checked)
  }

  render() {
    const { className, disabled, type, text, checked } = this.props
    const hasText = !isEmpty(text)

    return (
      <Button
        className={classNames(
          styles.wrapper,
          {
            [styles[type]]: checked,
          },
          className
        )}
        type="default"
        onClick={this.toggleSwitch}
      >
        <label
          className={classNames(styles.switch, {
            [styles.disabled]: disabled,
            [styles.on]: checked,
          })}
        >
          {hasText && <span className={styles.inner}>{text}</span>}
        </label>
      </Button>
    )
  }
}
