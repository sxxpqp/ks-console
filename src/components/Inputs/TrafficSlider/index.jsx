import { isUndefined } from 'lodash'
import React from 'react'
import { Slider } from '@kube-design/components'

import styles from './index.scss'

const SLIDER_PROPS = {
  className: styles.slider,
  railStyle: {
    height: 30,
    backgroundColor: '#7eb8dc',
    borderRadius: 2,
  },
  handleStyle: {
    width: 14,
    height: 30,
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 0,
    border: 'none',
  },
  trackStyle: { height: 30, borderRadius: 2, backgroundColor: '#329dce' },
}

export default class TrafficSlider extends React.PureComponent {
  static defaultProps = {
    defaultValue: 50,
  }

  render() {
    const { leftContent, rightContent, defaultValue, ...rest } = this.props
    const value = isUndefined(rest.value) ? defaultValue : rest.value

    return (
      <div className={styles.wrapper}>
        <Slider
          min={0}
          max={100}
          defaultValue={value}
          {...rest}
          {...SLIDER_PROPS}
        />
        <span
          className={styles.floatContent}
          style={{
            left: `${Math.floor(value / 2)}%`,
            maxWidth: `${value}%`,
          }}
        >
          {`${leftContent} ${value}%`}
        </span>
        <span
          className={styles.floatContent}
          style={{
            left: `${Math.floor(value / 2) + 50}%`,
            maxWidth: `${100 - value}%`,
          }}
        >
          {`${rightContent} ${100 - value}%`}
        </span>
      </div>
    )
  }
}
