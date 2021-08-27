import React from 'react'
import PropTypes from 'prop-types'

import { Alert, Form } from '@kube-design/components'
import { Modal } from 'components/Base'
import { get, isEmpty } from 'lodash'
import TaintInput from './TaintInput'

import styles from './index.scss'

export default class TaintManagementModal extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    value: [{}],
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      formData: { spec: { taints: props.value } },
    }
  }

  componentDidUpdate(prevProps) {
    const { visible, value } = this.props
    if (visible && visible !== prevProps.visible && prevProps.value !== value) {
      this.setState({ formData: { spec: { taints: value } } })
    }
  }

  handleSubmit = data => {
    const tainValueList = get(data, 'spec.taints')

    if (!isEmpty(tainValueList)) {
      const isValueMap = {}
      let isSumbit = true

      tainValueList.forEach(element => {
        if (isValueMap[element.key]) {
          isSumbit = false
        } else {
          isValueMap[element.key] = 1
        }
      })

      if (isSumbit) {
        this.props.onOk(data)
      }
    } else {
      this.props.onOk(data)
    }
  }

  render() {
    const { value, onOk, ...rest } = this.props
    return (
      <Modal.Form
        width={1162}
        bodyClassName={styles.body}
        title={t('Taint Management')}
        icon="wrench"
        okText={t('Save')}
        data={this.state.formData}
        onOk={this.handleSubmit}
        {...rest}
      >
        <div className={styles.wrapper}>
          <div className={styles.title}>{t('Taint')}</div>
          <Alert type="info" message={t('TAINTS_MSG')} />
          <div className={styles.content}>
            <Form.Item>
              <TaintInput name="spec.taints" />
            </Form.Item>
          </div>
        </div>
      </Modal.Form>
    )
  }
}
