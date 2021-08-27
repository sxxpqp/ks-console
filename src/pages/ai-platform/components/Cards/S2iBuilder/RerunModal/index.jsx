import React from 'react'
import PropTypes from 'prop-types'

import { Checkbox, Form, Input } from '@kube-design/components'
import { Modal } from 'components/Base'

import styles from './index.scss'

export default class RerunModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
    isSubmitting: false,
    url: '',
  }

  constructor(props) {
    super(props)

    this.form = React.createRef()
  }

  handleOk = () => {
    const { onOk } = this.props
    if (this.form) {
      const current = this.form.current || {}
      const formData = current.getData()

      onOk(formData)
    }
  }

  renderEnableUpdate = () => (
    <div className={styles.checkboxCard}>
      <label>
        <Form.Item>
          <Checkbox name="isUpdateWorkload" defaultValue={true}>
            <span name className={styles.title}>
              {t('S2I_UPDATE_WORKLOAD')}
            </span>
          </Checkbox>
        </Form.Item>
      </label>
      <p className={styles.desc}>{t('S2I_UPDATA_WORKLOAD_DESC')}</p>
    </div>
  )

  render() {
    const { visible, isSubmitting, onCancel, detail } = this.props

    return (
      <Modal.Form
        formRef={this.form}
        width={691}
        title={t('Rerun')}
        icon="cdn"
        onOk={this.handleOk}
        okText={t('Rerun')}
        onCancel={onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
      >
        <Form.Item label={t('Repo Url')}>
          <Input name="url" defaultValue={detail.sourceUrl} readOnly />
        </Form.Item>
        <Form.Item label={t('New Tag')}>
          <Input name="newTag" placeholder={t('NEW_TAG_DESC')} />
        </Form.Item>
        {this.renderEnableUpdate()}
      </Modal.Form>
    )
  }
}
