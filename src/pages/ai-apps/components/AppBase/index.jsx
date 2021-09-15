import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { get } from 'lodash'
import moment from 'moment-mini'

import { getAppCategoryNames } from 'utils/app'

import styles from './index.scss'

export default class AppBase extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    app: PropTypes.object.isRequired,
  }

  static defaultProps = {
    app: {},
  }

  render() {
    const { className, app } = this.props

    return (
      <div className={classnames(styles.appBase, className)}>
        <h3>{t('Basic Info')}:</h3>
        <dl>
          <dt>{t('Category')}:</dt>
          <dd>{getAppCategoryNames(get(app, 'category_set', []))}</dd>
          <dt>{t('Homepage')}:</dt>
          <dd>{app.home || '-'} </dd>
          <dt>{t('Published Date')}:</dt>
          <dd>{moment(app.status_time).format(t('YYYY-MM-DD'))}</dd>
          <dt>{t('App ID')}:</dt>
          <dd>{app.app_id || '-'}</dd>
        </dl>
      </div>
    )
  }
}
