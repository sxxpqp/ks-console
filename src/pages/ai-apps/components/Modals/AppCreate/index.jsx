import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Button } from '@kube-design/components'
import { Modal } from 'components/Base'
import ToggleView from 'apps/components/ToggleView'
import { getDocsUrl } from 'utils'

import styles from './index.scss'

export default class AppCreate extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
  }

  render() {
    const { visible, onOk, ...rest } = this.props

    return (
      <Modal
        width={600}
        bodyClassName={styles.body}
        visible={visible}
        hideHeader
        {...rest}
      >
        <div className={classnames(styles.header, 'clearfix')}>
          <img src="/assets/application.svg" alt="" />
          <div className={styles.title}> {'创建容器应用模板'}</div>
          <div className={styles.description}>
            {
              '用户容器应用模板，可以快速的发布应用，默认创建为个人可见，需要管理员审核后成为公共模板'
            }
          </div>
        </div>
        <ToggleView className={styles.item} title={t('UPLOAD_HELM_TITLE')} show>
          <div className={styles.more}>
            <div className={styles.description}>
              {t('UPLOAD_HELM_DESCRIPTION')}
            </div>
            <Button type={'control'} onClick={onOk}>
              {t('START_UPLOAD')}
            </Button>
            <div className={styles.note}>
              💁‍♂️ {t('APP_CREATE_GUIDE')}
              <a
                href={getDocsUrl('helm_specification')}
                target="_blank"
                rel="noreferrer noopener"
              >
                {t('HELM_DEVELOP_GUIDE')}
              </a>
            </div>
          </div>
        </ToggleView>
      </Modal>
    )
  }
}
