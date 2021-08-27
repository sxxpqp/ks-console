import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Form, Input, TextArea } from '@kube-design/components'
import { PATTERN_APPTEMPLATE_VERSION } from 'utils/constants'

import styles from './index.scss'

@observer
export default class VersionEdit extends React.Component {
  static propTypes = {
    formData: PropTypes.object,
    handleChange: PropTypes.func,
  }

  static defaultProps = {
    formData: {},
    handleChange() {},
  }

  handleChange = (value, name) => {
    this.props.handleChange(value, name)
  }

  render() {
    const { formData, formRef } = this.props

    return (
      <Form data={formData} ref={formRef} className={styles.editForm}>
        <Form.Item
          label={t('Version Number')}
          rules={[
            { required: true, message: t('Please input version number') },
            {
              pattern: PATTERN_APPTEMPLATE_VERSION,
              message: t('Invalid version'),
            },
          ]}
        >
          <Input
            name="name"
            autoFocus={true}
            maxLength={30}
            onChange={value => this.handleChange(value, 'name')}
          />
        </Form.Item>
        <Form.Item label={t('Update Log')} desc={t('UPDATE_LOG_DESC')}>
          <TextArea
            name="description"
            onChange={value => this.handleChange(value, 'description')}
          />
        </Form.Item>
      </Form>
    )
  }
}
