import React from 'react'
import { isObject } from 'lodash'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { ReactComponent as BackIcon } from 'assets/back.svg'
import { Image } from 'components/Base'

import styles from './index.scss'

export default class Banner extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
  }

  get isAppsPage() {
    return location.pathname === '/apps'
  }

  renderTopIntro() {
    const { detail } = this.props
    if (!(isObject(detail) && 'name' in detail)) {
      return null
    }

    const { name, description, icon } = detail

    return (
      <div className={styles.intro}>
        <span className={styles.icon}>
          <Image iconSize={48} iconLetter={name} src={icon} alt="" />
        </span>
        <div className={styles.text}>
          <div>{name}</div>
          <p>{description}</p>
        </div>
      </div>
    )
  }

  render() {
    const { onBack } = this.props
    return (
      <div className={styles.banner}>
        <div className={styles.inner}>
          <div className={styles.innerContent}>
            <div className={classnames(styles.shape, styles.shape_1)} />
            <div className={classnames(styles.shape, styles.shape_3)} />
            <div className={classnames(styles.shape, styles.shape_4)} />
            {this.isAppsPage ? (
              <>
                <div className={styles.leftShape_1} />
                <div className={styles.leftShape_2} />
              </>
            ) : (
              <div className={classnames(styles.shape, styles.shape_2)} />
            )}
            <div className={styles.appOutline}>
              <div className={styles.back}>
                <a className="custom-icon" href="#" onClick={onBack}>
                  <BackIcon />
                  <span>{t('Back')}</span>
                </a>
              </div>
              {this.renderTopIntro()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
