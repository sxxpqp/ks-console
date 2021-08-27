import React, { Component } from 'react'
import { range } from 'lodash'
import PropTypes from 'prop-types'

import { Alert, Slider, Form } from '@kube-design/components'
import { Modal } from 'components/Base'

import styles from './index.scss'

export default class ExpandVolume extends Component {
  static propTypes = {
    shouldAlertVisible: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    detail: PropTypes.object,
    max: PropTypes.number,
    min: PropTypes.number,
    visible: PropTypes.bool,
    title: PropTypes.string,
    okText: PropTypes.string,
  }

  static defaultProps = {
    detail: {},
    min: 0,
    max: 1024,
    title: 'Expand Volume',
    okText: 'Expand',
    shouldAlertVisible: false,
  }

  getMarks() {
    const max = this.props.max
    const count = 6
    return range(count).reduce((marks, index) => {
      const value = (max * index) / (count - 1)
      const mark = value === 0 ? '0' : `${Math.floor(value)}Gi`
      return { ...marks, [value]: mark }
    }, {})
  }

  render() {
    const {
      title,
      visible,
      onOk,
      shouldAlertVisible,
      okText,
      onCancel,
      detail,
    } = this.props

    return (
      <Modal.Form
        title={t(title)}
        visible={visible}
        icon={'scaling'}
        data={detail}
        okText={t(okText)}
        onCancel={onCancel}
        onOk={onOk}
      >
        {shouldAlertVisible && this.renderAlert()}
        {this.renderInput()}
      </Modal.Form>
    )
  }

  renderAlert() {
    return (
      <Alert
        className={styles.alert}
        type="warning"
        title={t('Expand Volume')}
        icon="exclamation"
        message={t('VOLUME_EXPAND_TIPS')}
      />
    )
  }

  renderInput() {
    const { max, min } = this.props
    const marks = this.getMarks()
    return (
      <Form.Item label={t('Volume Capacity')}>
        <Slider
          name="spec.resources.requests.storage"
          max={max}
          min={min}
          marks={marks}
          unit={'Gi'}
          withInput
        />
      </Form.Item>
    )
  }
}
