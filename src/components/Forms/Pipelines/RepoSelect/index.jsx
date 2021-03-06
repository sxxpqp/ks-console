import { isEmpty, get } from 'lodash'
import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Button, Icon } from '@kube-design/components'

import { REPO_KEY_MAP } from 'utils/constants'

import styles from './index.scss'

export default class valueSelect extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.object,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    name: '',
    value: {},
    onClick() {},
  }

  onChange = value => {
    this.props.onChange(value)
  }

  handleDeleteSource = () => {
    this.props.handleDeleteSource()
  }

  renderEmpty() {
    const { onClick } = this.props
    return (
      <div className={styles.empty} onClick={onClick}>
        <p>
          {t(
            'Please select a code repository as the code source for the pipeline.'
          )}
        </p>
      </div>
    )
  }

  getIconName = source_type => {
    let iconName = ''
    switch (source_type) {
      case 'single_svn':
        iconName = 'svn'
        break
      case 'bitbucket_server':
        'bitbucket-server'
        iconName = 'bitbucket'
        break
      default:
        iconName = source_type
    }
    return iconName
  }

  render() {
    const { value } = this.props
    if (isEmpty(value)) {
      return this.renderEmpty()
    }
    const data = get(value, `${REPO_KEY_MAP[value.source_type]}`, {})
    const iconName = this.getIconName(value.source_type)

    return (
      <div className={styles.wrapper}>
        <div className={classNames(styles.branch, styles.branch__show)}>
          <div className={styles.icon}>
            <Icon name={iconName} size={48} />
          </div>
          <div className={styles.info}>
            <div className={styles.name}>
              {data.repo || data.url || data.remote}
            </div>
            <div className={styles.desc}>{data.description || '-'}</div>
          </div>
          <div className={styles.action}>
            <Button onClick={this.props.onClick}>{t('Reselect')}</Button>
            {this.props.handleDeleteSource ? (
              <span
                onClick={this.handleDeleteSource}
                className={styles.deleteRepoBtn}
              >
                <Icon name="trash" />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}
