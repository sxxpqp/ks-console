import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button, Icon } from '@kube-design/components'

import styles from './index.scss'

export default class VersionSelect extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.array,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    value: '',
    options: [],
    onChange() {},
  }

  handleTakeOver = e => {
    this.props.onChange(e.currentTarget.dataset.version)
  }

  handleOffline = e => {
    const { onChange, options } = this.props
    const { version } = e.currentTarget.dataset
    const selectOption = options.find(option => option.name !== version)
    selectOption && onChange(selectOption.name)
  }

  render() {
    const { value, options } = this.props

    return (
      <ul className={styles.wrapper}>
        {options.map(option => (
          <li
            key={option.name}
            className={classNames({ [styles.selected]: value === option.name })}
          >
            <Icon name="appcenter" size={40} />
            <div className={styles.text}>
              <p>{`${t('Version')}: ${option.name}`}</p>
              <p>{`${t('Replicas')}: ${option.replicas}`}</p>
            </div>
            {value !== option.name ? (
              <Button
                className={styles.button}
                type="control"
                data-version={option.name}
                onClick={this.handleTakeOver}
              >
                {t('Take over all traffic')}
              </Button>
            ) : (
              <Button
                className={styles.button}
                data-version={option.name}
                onClick={this.handleOffline}
              >
                {t('Version offline')}
              </Button>
            )}
          </li>
        ))}
      </ul>
    )
  }
}
