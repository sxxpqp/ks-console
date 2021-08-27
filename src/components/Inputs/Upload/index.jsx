import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Column, Columns, Icon, Notify } from '@kube-design/components'
import { Upload } from 'components/Base'

import styles from './index.scss'

export default class UploadInput extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    defaultLogo: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    value: '',
    onChange() {},
  }

  constructor(props) {
    super(props)

    this.uploaderProps = {
      name: 'file',
      action: '/images/upload',
      accept: 'image/*',
      beforeUpload: file => {
        if (file.size > 1024 * 1024 * 2) {
          Notify.error(t('FILE_OVERSIZED_TIP'))
          return false
        }
        return true
      },
      onSuccess: res => {
        if (res) {
          props.onChange(res.path)
        }
      },
    }
  }

  render() {
    const { className, value, placeholder, defaultLogo } = this.props

    return (
      <Columns className={classNames('is-variable is-2', className)}>
        <Column className="is-narrow">
          <img
            className={classNames(styles.image, 'upload-preview')}
            src={value || defaultLogo}
          />
        </Column>
        <Column>
          <Upload {...this.uploaderProps}>
            <div className={styles.upload}>
              <Icon size={32} name="upload" />
              <p>{placeholder}</p>
            </div>
          </Upload>
        </Column>
      </Columns>
    )
  }
}
