import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty, get } from 'lodash'

import { Button, Icon } from '@kube-design/components'

import ProbeForm from '../ProbeForm'

import styles from './index.scss'

export default class ProbeInput extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
    onShowForm: PropTypes.func,
  }

  static defaultProps = {
    name: '',
    value: {},
    onChange() {},
    onShowForm() {},
  }

  state = {
    showForm: false,
  }

  getProbeTypeText = value => {
    if ('httpGet' in value) {
      return 'HTTP Request Check'
    }

    if ('tcpSocket' in value) {
      return 'TCP Port Check'
    }

    return 'Exec Command Check'
  }

  showForm = () => {
    this.setState({ showForm: true })
  }

  hideForm = () => {
    this.setState({ showForm: false })
  }

  handleForm = data => {
    const { onChange } = this.props
    onChange(data)
    this.hideForm()
  }

  handleDelete = () => {
    const { onChange } = this.props
    onChange({})
  }

  renderProbeInfo() {
    const { value } = this.props

    if ('httpGet' in value) {
      return (
        <>
          <div>
            <strong>{get(value, 'httpGet.scheme', '')}</strong>
            <p>{t('Type')}</p>
          </div>
          <div>
            <strong>{get(value, 'httpGet.path', '')}</strong>
            <p>{t('Path')}</p>
          </div>
          <div>
            <strong>{get(value, 'httpGet.port', '')}</strong>
            <p>{t('Port')}</p>
          </div>
        </>
      )
    }

    if ('tcpSocket' in value) {
      return (
        <div>
          <strong>{get(value, 'tcpSocket.port', '')}</strong>
          <p>{t('Port')}</p>
        </div>
      )
    }

    if ('exec' in value) {
      const commands = get(value, 'exec.command', [])
      return (
        <div>
          <strong>
            {commands[0]}
            {commands.length > 1 && ' ...'}
          </strong>
          <p>{t('Command')}</p>
        </div>
      )
    }

    return null
  }

  renderProbeForm() {
    const { probType, value } = this.props
    return (
      <ProbeForm
        className={styles.form}
        data={value}
        probType={probType}
        onSave={this.handleForm}
        onCancel={this.hideForm}
      />
    )
  }

  render() {
    const { type, description, value } = this.props
    const { showForm } = this.state

    if (showForm) {
      return <div className={styles.probe}>{this.renderProbeForm()}</div>
    }

    if (isEmpty(value)) {
      return (
        <div className={classnames(styles.empty)} onClick={this.showForm}>
          <div>{`${t('Add ')}${type}`}</div>
          <p className="text-secondary">{description}</p>
        </div>
      )
    }

    return (
      <div className={styles.probe}>
        <div className={styles.content}>
          <Icon name="monitor" size={40} />
          <div>
            <strong>{t(this.getProbeTypeText(value))}</strong>
            <p>
              <span>
                {t('Initial Delay')}: {`${value.initialDelaySeconds || 0}s`}
              </span>
              &nbsp;&nbsp;
              <span>
                {t('Timeout')}: {`${value.timeoutSeconds || 0}s`}
              </span>
            </p>
          </div>
          {this.renderProbeInfo()}
        </div>
        <div className="buttons">
          <Button type="flat" icon="trash" onClick={this.handleDelete} />
          <Button type="flat" icon="pen" onClick={this.showForm} />
        </div>
      </div>
    )
  }
}
