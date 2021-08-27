import React from 'react'
import { SwatchesPicker } from 'react-color'
import classnames from 'classnames'

import styles from './index.scss'

export default class ColorSelector extends React.Component {
  state = {
    shouldMenuShow: false,
  }

  startSelect = () => {
    this.setState({ shouldMenuShow: true })
  }

  changeComplete = ({ hex }) => {
    this.setState({ shouldMenuShow: false })
    this.props.onChange(hex)
  }

  render() {
    const { value, className } = this.props
    const { shouldMenuShow } = this.state

    return (
      <div className={classnames(styles.wrapper, className)}>
        <div
          style={{
            backgroundColor: value,
          }}
          onClick={this.startSelect}
        />
        {shouldMenuShow ? (
          <div className={styles.menu}>
            <SwatchesPicker onChangeComplete={this.changeComplete} />
          </div>
        ) : null}
      </div>
    )
  }
}
