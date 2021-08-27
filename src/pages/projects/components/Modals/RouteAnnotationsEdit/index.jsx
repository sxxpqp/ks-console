import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import { Form } from '@kube-design/components'
import { Modal } from 'components/Base'
import { AnnotationsInput } from 'components/Inputs'

import styles from './index.scss'

@observer
class RouteAnnotationsEdit extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    detail: {},
    isSubmitting: false,
    onOk: () => {},
    onCancel: () => {},
  }

  constructor(props) {
    super(props)

    this.state = {
      formTemplate: props.detail,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.detail !== prevProps.detail) {
      this.setState({ formTemplate: this.props.detail })
    }
  }

  handleOk = data => {
    const { onOk } = this.props
    onOk(data)
  }

  render() {
    const { visible, onCancel, isSubmitting } = this.props

    return (
      <Modal.Form
        title={t('Edit Annotations')}
        icon="firewall"
        visible={visible}
        width={960}
        data={this.state.formTemplate}
        onOk={this.handleOk}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
      >
        <div className={styles.wrapper}>
          <div className={styles.formWrapper}>
            <Form.Item>
              <AnnotationsInput
                name="metadata.annotations"
                hiddenKeys={globals.config.preservedAnnotations}
                addText={t('Add Annotation')}
              />
            </Form.Item>
          </div>
        </div>
      </Modal.Form>
    )
  }
}

export default RouteAnnotationsEdit
