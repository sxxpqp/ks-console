import React from 'react'
import classnames from 'classnames'
import { Icon } from '@kube-design/components'
import { get, isArray } from 'lodash'

import { getLanguageName, parseUrl, formatSize } from 'utils'

import styles from './index.scss'

export default class BuilderInfo extends React.Component {
  pathAddCluster = (path, cluster) => {
    const match = path.match(/(\/kapis|api|apis)(.*)/)
    return !cluster || cluster === 'default' || !isArray(match)
      ? path
      : `${match[1]}/clusters/${cluster}${match[2]}`
  }

  renderB2i() {
    const { className, params, runDetail } = this.props
    const {
      builderImage,
      sourceUrl,
      binaryName,
      binarySize,
      status,
    } = runDetail
    const { cluster } = params
    const path = get(parseUrl(sourceUrl), 'pathname', `/${sourceUrl}`)
    const url = this.pathAddCluster(path, cluster)
    const downLoadUrl = `${window.location.protocol}//${window.location.host}/b2i_download${url}`
    return (
      <ul className={classnames(styles.builderContent, className)}>
        <li>
          <span className={styles.icon}>
            <Icon name={getLanguageName(builderImage)} size={40} />
          </span>
          <div className={styles.info}>
            <p className={styles.value} title={builderImage}>
              {builderImage}
            </p>
            <p className={styles.name}>{t('builderImage')}</p>
          </div>
        </li>
        <li className={styles.downloadContent}>
          <a href={status !== 'Success' ? null : downLoadUrl} download>
            <span className={styles.icon}>
              <Icon name="resource" size={40} />
            </span>
            <div className={styles.info}>
              <p className={styles.value} title={binaryName}>
                {binaryName}
              </p>
              <p className={styles.name}>
                {`${t('File Size')}: ${formatSize(binarySize)}`}
              </p>
            </div>
          </a>
        </li>
      </ul>
    )
  }

  render() {
    const { className, isB2i } = this.props

    if (isB2i) {
      return this.renderB2i()
    }

    const { sourceUrl, builderImage, revisionId } = this.props.runDetail

    return (
      <ul className={classnames(styles.builderContent, className)}>
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
            <p className={styles.value} title={builderImage}>
              {builderImage}
            </p>
            <p className={styles.name}>{t('builderImage')}</p>
          </div>
        </li>
        <li>
          <span className={styles.icon}>
            <Icon name="resource" size={40} />
          </span>
          <div className={styles.info}>
            <p className={styles.value} title={sourceUrl}>
              {sourceUrl}
            </p>
            <p className={styles.name}>{t('sourceUrl')}</p>
          </div>
        </li>
        <li>
          <Icon name="branch" className={styles.icon} />
          <div className={styles.info}>
            <p className={styles.value}>{revisionId || 'master'}</p>
            <p className={styles.name}>{t('Branch')}</p>
          </div>
        </li>
      </ul>
    )
  }
}
