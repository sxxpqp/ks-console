import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Form, Icon, Input } from '@kube-design/components'
import { isEqual } from 'lodash'

import { Modal } from 'components/Base'
import { CATEGORY_ICONS } from 'configs/openpitrix/app'

import styles from './index.scss'

export default class CategoryCreate extends Component {
  static propTypes = {
    detail: PropTypes.object,
    categoryNames: PropTypes.array,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    detail: {},
    categoryNames: [],
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)
    this.state = {
      name: this.props.detail.name,
      description: this.props.detail.description,
    }
  }

  componentDidUpdate(prevProps) {
    const { detail } = this.props
    if (!isEqual(detail, prevProps.detail)) {
      this.setState({
        name: detail.name,
        description: detail.description,
      })
    }
  }

  changeName = name => {
    this.setState({ name })
  }

  changeIcon = icon => {
    this.setState({ description: icon })
  }

  nameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    const { detail, categoryNames } = this.props
    if (value !== detail.name && categoryNames.includes(value)) {
      return callback({ message: t('Name exists'), field: rule.field })
    }

    callback()
  }

  createOrModify = () => {
    const data = {
      name: this.state.name,
      description: this.state.description,
      locale: '{}',
    }

    const { category_id } = this.props.detail
    if (category_id) {
      data.category_id = category_id
    }

    this.formRef.validate(() => {
      this.props.onOk(data)
    })
  }

  onCancel = () => {
    this.setState({ name: '', description: '' })
    this.props.onCancel()
  }

  render() {
    const { visible, ...rest } = this.props
    const formData = {
      name: this.state.name,
      description: this.state.description,
    }

    return (
      <Modal
        width={600}
        visible={visible}
        footerClassName={styles.footer}
        {...rest}
        onOk={this.createOrModify}
        onCancel={this.onCancel}
      >
        <Form
          data={formData}
          ref={form => {
            this.formRef = form
          }}
        >
          <Form.Item
            label={t('Category Name')}
            desc={t('CATEGORY_NAME_DESC')}
            rules={[
              { required: true, message: t('Please input category name') },
              { validator: this.nameValidator },
            ]}
          >
            <Input name="name" onChange={this.changeName} maxLength={20} />
          </Form.Item>
          <Form.Item label={t('Icon')}>
            <div
              name="description"
              className={styles.icons}
              value={formData.description}
            >
              {CATEGORY_ICONS.map(icon => (
                <label
                  key={icon}
                  onClick={() => this.changeIcon(icon)}
                  className={classnames({
                    [styles.active]: icon === formData.description,
                  })}
                >
                  <Icon name={icon} size={20} />
                </label>
              ))}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
