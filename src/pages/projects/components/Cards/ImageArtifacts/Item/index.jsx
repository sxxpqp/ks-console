import React from 'react'
import { observer } from 'mobx-react'
import { getLocalTime, formatSize } from 'utils'

import { Icon, Notify } from '@kube-design/components'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import styles from './index.scss'

@observer
export default class ImageRunRecords extends React.Component {
  handleCopy = () => {
    Notify.success({
      content: t('Copy Successfully'),
    })
  }

  render() {
    const {
      imageName,
      imageCreated,
      imageSize,
      commandPull,
    } = this.props.runDetail
    const { loading } = this.props

    if (loading) {
      return null
    }

    return (
      <ul className={styles.item}>
        <Icon name="cdn" size={40} />
        <li>
          <div className={styles.value}>{imageName}</div>
          <div className={styles.label}>{t('ImageName')}</div>
        </li>
        <li>
          <div className={styles.value}>{formatSize(imageSize)}</div>
          <div className={styles.label}>{t('Image Size')}</div>
        </li>
        <li>
          <div className={styles.value}>
            {commandPull}
            <CopyToClipboard text={commandPull} onCopy={this.handleCopy}>
              <Icon className={styles.copyIcon} name="copy" changeable />
            </CopyToClipboard>
          </div>
          <div className={styles.label}>{t('Pull Command')}</div>
        </li>
        <li>
          <div className={styles.value}>
            {getLocalTime(imageCreated).format('YYYY-MM-DD HH:mm:ss')}
          </div>
          <div className={styles.label}>{t('Publish Time')}</div>
        </li>
      </ul>
    )
  }
}
