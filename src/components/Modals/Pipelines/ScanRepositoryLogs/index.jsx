import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Button, Notify } from '@kube-design/components'
import { observer } from 'mobx-react'
import { get, isEmpty } from 'lodash'
import { Modal } from 'components/Base'

import styles from './index.scss'

@observer
export default class ScanRepositoryLogs extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    branches: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.refresh = setInterval(() => {
      this.refreshHandler()
    }, 4000)
  }

  static defaultProps = {
    branches: [],
    visible: false,
    onOk() {},
    onCancel() {},
  }

  componentDidMount() {
    const { params } = this.props
    this.props.store.getRepoScanLogs(params)
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      const { params } = this.props
      this.props.store.getRepoScanLogs(params)
    }
  }

  componentWillUnmount() {
    clearInterval(this.refresh)
  }

  refreshHandler = () => {
    const { repositoryLog } = this.props.store
    const arr = repositoryLog.split('\n')
    let isDone = false

    for (let i = arr.length - 1; i >= 0; i--) {
      if (!isEmpty(arr[i]) && arr[i].indexOf('Finished') > -1) {
        isDone = true
        return
      }
    }
    if (isDone) {
      clearInterval(this.refresh)
      this.refresh = null
    } else {
      const { params } = this.props
      this.props.store.getRepoScanLogs(params)
    }
  }

  get startBy() {
    const { repositoryLog } = this.props.store
    const arr = repositoryLog.split('\n')
    const firstLine = get(arr, '[0]', '')
    const parser = firstLine.match(/^Started by (user )?(.*)?/) || []
    const isUser = parser[1]
    const name = parser[2]

    if (firstLine && isUser) {
      return `${t('Started By')}: ${name}`
    }

    if (firstLine && !isUser) {
      return t('Started By {name}', { name: t(name) })
    }

    return `${t('Started By')}: -`
  }

  handleFetch = async () => {
    const { params } = this.props
    await this.props.handleScanRepository()
    await this.props.store.getRepoScanLogs(params)

    Notify.success({
      content: t('Logs Scanned Successfully'),
    })
  }

  handleDownloadLogs = () => {
    const { repositoryLog } = this.props.store

    this.props.store.saveAsFile(repositoryLog, 'log.txt')
  }

  render() {
    const { visible, onCancel } = this.props
    const { repositoryLog } = this.props.store

    return (
      <Modal
        width={1160}
        onCancel={onCancel}
        visible={visible}
        closable={false}
        title={t('Scan Repository Logs')}
      >
        <div className={styles.content}>
          <div className={styles.btn_group}>
            <Icon name="human" size={20} />
            {this.startBy}
            <Button onClick={this.handleDownloadLogs}>
              {t('Download Logs')}
            </Button>
            <Button onClick={this.handleFetch}>{t('Rescan')}</Button>
          </div>
          <pre className={styles.pre}>{repositoryLog}</pre>
        </div>
      </Modal>
    )
  }
}
