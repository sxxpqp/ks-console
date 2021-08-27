import React from 'react'
import classnames from 'classnames'
import { Icon } from '@kube-design/components'

import { getLanguageName } from 'utils'

import styles from './index.scss'

export default class BuilderInfo extends React.Component {
  static defaultProps = {
    config: {
      sourceUrl: '-',
      builderImage: '-',
    },
  }

  render() {
    const { className } = this.props
    const { sourceUrl, builderImage } = this.props.config
    return (
      <ul className={classnames(styles.builderContent, className)}>
        <li>
          <span className={styles.icon}>
            <Icon name="resource" size={24} />
          </span>
          <div className={styles.info}>
            <p className={styles.value}>{sourceUrl}</p>
            <p className={styles.name}>{t('sourceUrl')}</p>
          </div>
        </li>
        <li>
          <span
            className={styles.icon}
            style={{
              backgroundImage: `url('/assets/${getLanguageName(
                builderImage
              )}.png')`,
            }}
          />
          <div className={styles.info}>
            <p className={styles.value}>{builderImage}</p>
            <p className={styles.name}>{t('builderImage')}</p>
          </div>
        </li>
      </ul>
    )
  }
}
