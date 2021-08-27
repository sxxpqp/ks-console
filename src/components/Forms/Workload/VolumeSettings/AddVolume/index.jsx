import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isEmpty } from 'lodash'

import { RadioGroup, RadioButton } from '@kube-design/components'
import { ReactComponent as BackIcon } from 'assets/back.svg'

import ObjectMapeer from 'utils/object.mapper'

import AddExistVolumes from '../AddExistVolumes'
import AddTemporary from '../AddTemporary'
import AddHostPath from '../AddHostPath'

import styles from './index.scss'

export default class AddVolume extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    containers: PropTypes.array,
    volume: PropTypes.object,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    volume: {},
    containers: [],
    onSave() {},
    onCancel() {},
  }

  static contextTypes = {
    registerSubRoute: PropTypes.func,
    resetSubRoute: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.formRef = React.createRef()

    this.state = {
      type: this.checkVolumeType(props.volume) || 'exist',
    }
  }

  componentDidMount() {
    const { onCancel } = this.props
    const { registerSubRoute } = this.context
    registerSubRoute && registerSubRoute(this.handleSubmit, onCancel)
  }

  handleGoBack = () => {
    const { resetSubRoute } = this.context

    resetSubRoute && resetSubRoute()

    this.props.onCancel()
  }

  checkVolumeType(volume) {
    let type = 'exist'

    if (isEmpty(volume)) {
      return type
    }

    if (volume.emptyDir) {
      type = 'temp'
    } else if (volume.hostPath) {
      type = 'host'
    }

    return type
  }

  handleSubmit = callback => {
    const { onSave } = this.props
    const { type } = this.state
    const form = this.formRef.current

    form &&
      form.validate(() => {
        const data = form.getData()

        let volume
        if (type === 'exist') {
          volume = data.volume
        } else if (type === 'temp') {
          volume = { name: data.name, emptyDir: {} }
        } else if (type === 'host') {
          const { volumeMounts, ...rest } = data
          volume = rest
        } else if (type === 'new') {
          const { volumeMounts, ...rest } = data
          volume = ObjectMapeer.volumes(rest)
        }

        let volumeMounts = []
        if (data.volumeMounts) {
          volumeMounts = data.volumeMounts.map(item => ({
            ...item,
            volume,
          }))
        }

        onSave(volume, volumeMounts)
        callback && callback()
      })
  }

  handleTypeChange = type => {
    this.setState({ type })
  }

  renderContent() {
    const {
      volume,
      volumes,
      containers,
      checkVolumeNameExist,
      collectSavedLog,
    } = this.props
    let content

    const currentName = volume.name
    switch (this.state.type) {
      case 'temp': {
        content = (
          <AddTemporary
            formRef={this.formRef}
            formData={volume}
            currentName={currentName}
            containers={containers}
            checkVolumeNameExist={checkVolumeNameExist}
            collectSavedLog={collectSavedLog}
          />
        )
        break
      }
      case 'host': {
        content = (
          <AddHostPath
            formRef={this.formRef}
            formData={volume}
            currentName={currentName}
            containers={containers}
            checkVolumeNameExist={checkVolumeNameExist}
          />
        )
        break
      }
      default:
      case 'exist': {
        content = (
          <AddExistVolumes
            formRef={this.formRef}
            formData={volume}
            currentName={currentName}
            volumes={volumes}
            containers={containers}
            collectSavedLog={collectSavedLog}
          />
        )
        break
      }
    }

    return content
  }

  render() {
    const { className, contentClassName } = this.props
    return (
      <div className={classNames(styles.wrapper, className)}>
        <div className="h6">
          <a className="custom-icon" onClick={this.handleGoBack}>
            <BackIcon />
          </a>
          {t('Volumes')}
        </div>
        <div className={classNames(styles.contentWrapper, contentClassName)}>
          <div className={styles.title}>{t('Volume Source')}</div>
          <RadioGroup
            mode="button"
            value={this.state.type}
            onChange={this.handleTypeChange}
            size="small"
          >
            <RadioButton value="exist">{t('Existing Volume')}</RadioButton>
            <RadioButton value="temp">{t('Temporary Volume')}</RadioButton>
            <RadioButton value="host">{t('HostPath')}</RadioButton>
          </RadioGroup>
          {this.renderContent()}
        </div>
      </div>
    )
  }
}
