import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isUndefined, isEmpty } from 'lodash'

import { Icon, Tag, Tooltip, Notify } from '@kube-design/components'
import { Indicator, Modal } from 'components/Base'
import { createCenterWindowOpt } from 'utils/dom'
import { getContainerStatus } from 'utils/status'
import ContainerLogModal from 'components/Modals/ContainerLog'

import SaveImageModal from 'components/Modals/SaveImage/index'

import { UploadOutlined, CloudDownloadOutlined } from '@ant-design/icons'
import { Upload } from 'antd'

import { saveDocker } from 'api/docker'
import BaseStore from 'stores/base'
import styles from './index.scss'

export default class ContainerItem extends React.Component {
  constructor(props) {
    super(props)
    this.store = new BaseStore()
  }

  static propTypes = {
    className: PropTypes.string,
    prefix: PropTypes.string,
    detail: PropTypes.object,
    podName: PropTypes.string,
    isCreating: PropTypes.bool,
  }

  static defaultProps = {
    prefix: '',
    detail: {},
    isCreating: false,
  }

  state = {
    showContainerLog: false,
    fileList: [],
  }

  get canViewTerminal() {
    const { cluster } = this.props
    const { namespace } = this.props.detail
    return globals.app.hasPermission({
      module: 'pods',
      project: namespace,
      action: 'edit',
      cluster,
    })
  }

  getLink = name => `${this.props.prefix}/containers/${name}`

  handleOpenTerminal = () => {
    const { cluster, podName } = this.props
    const { namespace, name } = this.props.detail

    const terminalUrl = `/terminal/cluster/${cluster}/projects/${namespace}/pods/${podName}/containers/${name}`
    window.open(
      terminalUrl,
      `Connecting ${name}`,
      createCenterWindowOpt({
        width: 1200,
        height: 800,
        scrollbars: 1,
        resizable: 1,
      })
    )
  }

  handleUpload = info => {
    // console.log('🚀 ~ file: Item.jsx ~ line 69 ~ ContainerItem ~ info', info)

    let fileList = [...info.fileList]

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-2)

    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url
      }
      return file
    })

    if (!fileList.some(item => item.status !== 'done')) {
      Notify.success({
        content: '上传成功，请使用终端在容器的/tmp目录中查看',
      })
    }

    this.setState({ fileList })
  }

  showContainerLog = () => {
    this.setState({ showContainerLog: true })
  }

  hideContainerLog = () => {
    this.setState({ showContainerLog: false })
  }

  // eslint-disable-next-line no-unused-vars
  handleSave(item) {
    const extra = this.getExtraData()
    const modal = Modal.open({
      onOk: async data => {
        // console.log(
        //   '🚀 ~ file: index.jsx ~ line 218 ~ Deployments ~ handleSave ~ data',
        //   data
        // )
        const images = data.image.split(':')
        const res = await saveDocker({
          hubInfo: {
            url: data.dockerHub,
          },
          ...extra,
          imageInfo: {
            name: images[0],
            tag: images.length > 1 ? images[1] : 'latest',
          },
        })
        if (res.status === 200) {
          const { code, data: resData } = res.data
          if (code === 200 && resData.imageName) {
            Notify.success({
              content: `镜像推送成功${resData.imageName}，请跳转harbor平台查看`,
            })
          } else {
            Notify.error({
              content: `镜像推送失败${resData.res.stdout}`,
            })
          }
        }
        Modal.close(modal)
      },
      title: '应用固化发布',
      modal: SaveImageModal,
      store: this.store,
      ...this.props,
    })
  }

  renderProbe() {
    const { livenessProbe, readinessProbe, startupProbe } = this.props.detail

    if (!livenessProbe && !readinessProbe && !startupProbe) return null

    return (
      <div className={styles.probe}>
        {this.renderProbeRecord({
          probe: readinessProbe,
          title: t('Readiness Probe'),
          tagType: 'primary',
        })}
        {this.renderProbeRecord({
          probe: livenessProbe,
          title: t('Liveness Probe'),
          tagType: 'warning',
        })}
        {this.renderProbeRecord({
          probe: startupProbe,
          title: t('Startup Probe'),
          tagType: 'info',
        })}
      </div>
    )
  }

  renderProbeRecord({ probe, title, tagType }) {
    if (!probe) return null

    const delay = probe.initialDelaySeconds || 0
    const timeout = probe.timeoutSeconds || 0
    let probeType
    let probeDetail

    if ('httpGet' in probe) {
      const { path, port, scheme } = probe.httpGet
      probeType = 'HTTP Request Check'
      probeDetail = `GET ${path} on port ${port} (${scheme})`
    } else if ('tcpSocket' in probe) {
      probeType = 'TCP Port Check'
      probeDetail = `Open socket on port ${probe.tcpSocket.port} (TCP)`
    } else {
      const { command = [] } = probe.exec
      probeType = 'Exec Command Check'
      probeDetail = command.join(' ')
    }

    return (
      <div className={styles.probeItem}>
        <div>
          <Tag type={tagType}>{title}</Tag>
          <span className={styles.probeType}>{t(probeType)}</span>
          <span className={styles.probeTime}>
            {t('Initial Delay')}: {delay}s &nbsp;&nbsp;
            {t('Timeout')}: {timeout}s
          </span>
        </div>
        <p>{probeDetail}</p>
      </div>
    )
  }

  getExtraData = () => {
    const { namespace, name, containerID } = this.props.detail
    const { node } = this.props

    return {
      containerID,
      namespace,
      name,
      ...node,
    }
  }

  render() {
    const {
      className,
      detail,
      isCreating,
      prefix,
      podName,
      cluster,
      isInit,
      onContainerClick,
      ...rest
    } = this.props
    const { showContainerLog } = this.state
    const link = this.getLink(detail.name)
    const { status, reason } = getContainerStatus(detail)
    const hasProbe = detail.livenessProbe || detail.readinessProbe

    const uploadProps = {
      action: '/upload',
      onChange: this.handleUpload,
      multiple: true,
      data: this.getExtraData,
      name: 'file',
    }

    return (
      <div className={classnames(styles.item, className)} {...rest}>
        <div className={styles.icon}>
          <Icon name="docker" size={40} />
          {!isUndefined(detail.ready) && (
            <Indicator className={styles.indicator} type={status} flicker />
          )}
        </div>
        <div className={classnames(styles.text, styles.name)}>
          <div>
            {prefix && status !== 'terminated' ? (
              <Link to={link}>
                <span onClick={onContainerClick}>{detail.name}</span>
              </Link>
            ) : (
              <span className={styles.noLink}>{detail.name}</span>
            )}
            {prefix && !isCreating && (
              <Tooltip content={t('Container Logs')}>
                <Icon
                  className="margin-l8"
                  name="log"
                  size={16}
                  clickable
                  onClick={this.showContainerLog}
                />
              </Tooltip>
            )}
            {status === 'running' && prefix && this.canViewTerminal && (
              <Tooltip content={t('Terminal')}>
                <Icon
                  className="margin-l8"
                  name="terminal"
                  size={16}
                  clickable
                  onClick={this.handleOpenTerminal}
                />
              </Tooltip>
            )}
            {isInit && (
              <Tag className="margin-l8" type="warning">
                {t('Init Container')}
              </Tag>
            )}
            {hasProbe && (
              <Tooltip content={this.renderProbe()}>
                <Tag className="margin-l8">{t('Probe')}</Tag>
              </Tooltip>
            )}
            {/* 上传功能 */}
            <Upload {...uploadProps} showUploadList={false}>
              <Tooltip content="上传文件">
                <UploadOutlined
                  className="margin-l8"
                  style={{ fontSize: '15px' }}
                />
              </Tooltip>
            </Upload>
            {/* 固化 */}
            <Tooltip content="固化">
              <CloudDownloadOutlined
                className="margin-l8"
                style={{ fontSize: '16px' }}
                onClick={() => this.handleSave(detail)}
              />
            </Tooltip>
          </div>
          {reason ? (
            <p>{t(reason)}</p>
          ) : (
            <p>
              {t('Image')}:{detail.image}
            </p>
          )}
        </div>
        <div className={styles.text}>
          <div>{isUndefined(status) ? '-' : t(status)}</div>
          <p>{t('Status')}</p>
        </div>
        <div className={styles.text}>
          <div>
            {isUndefined(detail.restartCount) ? '-' : detail.restartCount}
          </div>
          <p>{t('Restart Count')}</p>
        </div>
        <div className={styles.text}>
          <div>
            {isEmpty(detail.ports)
              ? '-'
              : detail.ports
                  .map(port => `${port.containerPort}/${port.protocol}`)
                  .join(', ')}
          </div>
          <p>{t('Ports')}</p>
        </div>
        <ContainerLogModal
          visible={showContainerLog}
          podName={podName}
          container={detail}
          cluster={cluster}
          onCancel={this.hideContainerLog}
        />
      </div>
    )
  }
}
