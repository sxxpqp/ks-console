import React from 'react'
import PropTypes from 'prop-types'
import { saveAs } from 'file-saver'

import { Button, Icon, Notify } from '@kube-design/components'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Modal, CodeEditor } from 'components/Base'

import styles from './index.scss'

export default class KubeConfigModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    data: PropTypes.string,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    data: '',
    onCancel() {},
  }

  handleCopy = () => {
    Notify.success({
      content: t('Copy Successfully'),
    })
  }

  handleDownload = () => {
    const text = this.props.data
    const fileName = 'kubeconfig.yaml'
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, fileName)
  }

  render() {
    const { data, onCancel, onOk, ...rest } = this.props

    const options = { readOnly: true, height: 500 }

    return (
      <Modal
        headerClassName={styles.header}
        bodyClassName={styles.body}
        width={756}
        hideFooter
        hideHeader
        onCancel={onCancel}
        {...rest}
      >
        <div className={styles.header}>
          <Icon name="coding" size={40} />
          <div className={styles.title}>{t('Kubeconfig File')}</div>
        </div>
        <div className={styles.content}>
          <div className={styles.topbar}>
            <p>{`${t('Put this into')} ~/.kube/config:`}</p>
            <Button icon="download" ghost onClick={this.handleDownload}>
              {t('Download File')}
            </Button>
          </div>
          <div className={styles.editor}>
            <CodeEditor
              className={styles.codeEditor}
              value={data}
              options={options}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <Button type="default" onClick={onCancel}>
            {t('Cancel')}
          </Button>
          <CopyToClipboard text={data} onCopy={this.handleCopy}>
            <Button type="control">{t('Copy')}</Button>
          </CopyToClipboard>
        </div>
      </Modal>
    )
  }
}
