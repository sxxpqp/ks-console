import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import moment from 'moment-mini'

import { Markdown } from 'components/Base'
import ImageSlider from './ImageSlider'

import styles from './index.scss'

export default class AppInfo extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    app: PropTypes.object.isRequired,
    versions: PropTypes.array,
  }

  static defaultProps = {
    app: {},
    versions: [],
  }

  filterImages(images) {
    if (typeof images === 'string') {
      return images
        .split(',')
        .map(v => v.trim())
        .filter(Boolean)
    }
    if (Array.isArray(images)) {
      return images
    }
    return []
  }

  renderVersionTable() {
    const { versions } = this.props

    return (
      <table className={styles.versions}>
        <thead>
          <tr>
            <th>{t('Version Number')}</th>
            <th>{t('Change Log')}</th>
          </tr>
        </thead>

        <tbody>
          {versions.map(({ name, description, status_time, version_id }) => (
            <tr key={version_id}>
              <td>
                <p className={styles.name}>{name}</p>
                <p className={styles.date}>
                  {moment(status_time).format(t('YYYY-MM-DD'))}
                </p>
              </td>
              <td>
                <p className={styles.desc}>{description || '-'}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  render() {
    const { className, app } = this.props
    const { abstraction, screenshots } = app

    return (
      <div className={classnames(styles.appInfo, className)}>
        <div>
          <h3 className={styles.title}>{t('Introduction')}</h3>
          <Markdown source={abstraction || t('None')} />
        </div>
        <div>
          <h3 className={styles.title}>{t('Screenshots')}</h3>
          <ImageSlider images={this.filterImages(screenshots)} />
        </div>
        <div>
          <h3 className={styles.title}>
            {t('Versions')} ({t('VERSION_LIST_DES')})
          </h3>
          {this.renderVersionTable()}
        </div>
      </div>
    )
  }
}
