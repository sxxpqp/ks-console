import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Icon } from '@kube-design/components'
import { get } from 'lodash'

import { Image, Upload } from 'components/Base'
import { UPLOAD_FILE_TYPES, SCREENSHOTS_LIMIT } from 'configs/openpitrix/app'

import styles from './index.scss'

@observer
export default class Screenshots extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    store: PropTypes.object,
    fileStore: PropTypes.object,
  }

  static defaultProps = {
    detail: {},
    store: {},
    fileStore() {},
  }

  state = { error: '' }

  onUploadClick = () => {
    this.uploadRef.onClick()
  }

  uploadScreenshot = async (file, fileList) => {
    const { checkFile, handleFileByBase64Str } = this.props.fileStore
    const { uploadScreenshot } = this.props.store
    const { detail, handleChange } = this.props
    const result = checkFile(file, 'screenshots')

    if (result) {
      this.setState({ error: result })
    } else {
      const index = fileList.indexOf(file)

      handleFileByBase64Str(file, async base64Str => {
        this.setState({ error: '' })
        const screenshotStr = get(detail, 'screenshots', '')
        const screenshotsList = screenshotStr ? screenshotStr.split(',') : []
        const screenshots = await uploadScreenshot(
          base64Str,
          screenshotsList,
          index
        )
        handleChange(screenshots, 'screenshots')
      })
    }

    return Promise.reject()
  }

  deleteScreenshot = async (index, detail) => {
    const { handleChange, store } = this.props
    const { deleteScreenshot } = store
    const screenshotsList = await deleteScreenshot(index, detail)
    handleChange(screenshotsList, 'screenshots')
  }

  render() {
    const { error } = this.state
    const { detail } = this.props
    const screenshotStr = get(detail, 'screenshots', '')
    const screenshots = screenshotStr ? screenshotStr.split(',') : []
    const len = screenshots.length
    return (
      <div>
        <div className={styles.title}>{t('App Screenshots')}</div>
        <div className={styles.screenshot}>
          <ul className={styles.pictures}>
            {screenshots.map((item, index) => (
              <li key={index}>
                <Image src={item} isBase64Str />
                <div className={styles.delete}>
                  <label
                    onClick={() => {
                      this.deleteScreenshot(index, detail)
                    }}
                  >
                    <Icon name="trash" size={20} className={styles.icon} />
                    {t('Delete picture')}
                  </label>
                </div>
              </li>
            ))}
            {len < SCREENSHOTS_LIMIT && (
              <li className={styles.upload}>
                <Upload
                  multiple
                  className={styles.upload}
                  beforeUpload={this.uploadScreenshot}
                  ref={node => {
                    this.uploadRef = node
                  }}
                  accept={UPLOAD_FILE_TYPES.screenshot}
                >
                  <Icon name="add" size={48} className={styles.add} />
                </Upload>
              </li>
            )}
          </ul>
          {error ? (
            <div className={styles.error}>{t(this.state.error)}</div>
          ) : (
            <div className={styles.words}>
              {len}/{SCREENSHOTS_LIMIT} {t('screenshots')} (
              {t('FILE_MAX_SCREENSHOTS')})
              {len > 0 ? (
                <label
                  className={styles.deleteAll}
                  onClick={() => {
                    this.deleteScreenshot(-1, detail)
                  }}
                >
                  {t('Delete all')}
                </label>
              ) : (
                <label
                  className={classnames(styles.deleteAll, styles.disabled)}
                >
                  {t('Delete all')}
                </label>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}
