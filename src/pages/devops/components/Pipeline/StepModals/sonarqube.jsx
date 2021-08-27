import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import { observer } from 'mobx-react'
import { Modal } from 'components/Base'
import { Alert, Form, Input } from '@kube-design/components'

import styles from './index.scss'

@observer
export default class withSonarQubeEnv extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    edittingData: PropTypes.object,
  }

  static defaultProps = {
    edittingData: {},
    visible: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = { formData: {} }
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.edittingData.type === 'withSonarQubeEnv') {
      const formData = {
        name: get(nextProps.edittingData, 'data.value', ''),
      }
      return { formData }
    }
    return null
  }

  handleOk = () => {
    const current = this.formRef.current || {}
    const formData = current.getData()
    this.formRef.current.validate(() => {
      this.props.onAddStep({
        name: 'withSonarQubeEnv',
        arguments: {
          isLiteral: true,
          value: formData.name,
        },
        children: [],
      })
    })
  }

  render() {
    const { visible, onCancel } = this.props

    return (
      <Modal
        width={680}
        bodyClassName={styles.body}
        onCancel={onCancel}
        onOk={this.handleOk}
        visible={visible}
        closable={false}
        title={t('withSonarQubeEnv')}
      >
        <Form data={this.state.formData} ref={this.formRef}>
          <Alert
            type="info"
            className={styles.info}
            message={t(
              'Load the sonarqube configuration provided by Jenkins into the Pipeline.'
            )}
          />
          <Form.Item
            label={t('config name')}
            rules={[
              { required: true, message: t('This parameter is required') },
            ]}
            desc={t('sonar is the default config name.')}
          >
            <Input name="name" defaultValue={'sonar'} />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
