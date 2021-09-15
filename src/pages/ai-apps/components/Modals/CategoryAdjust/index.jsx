import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Select } from '@kube-design/components'

import { Modal } from 'components/Base'

import styles from './index.scss'

export default class CategoryAdjust extends Component {
  static propTypes = {
    categories: PropTypes.array,
    categoryId: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    categories: [],
    categoryId: '',
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)
    this.state = {
      categoryId: this.props.categoryId,
    }
  }

  get categories() {
    return [
      ...this.props.categories.map(({ name, category_id }) => ({
        label: t(`APP_CATE_${name.toUpperCase()}`, {
          defaultValue: name,
        }),
        value: category_id,
      })),
    ]
  }

  handleChange = categoryId => {
    this.setState({ categoryId })
  }

  adjustCategory = () => {
    this.props.onOk({ category_id: this.state.categoryId })
  }

  onCancel = () => {
    this.setState({ categoryId: '' })
    this.props.onCancel()
  }

  render() {
    const { ...rest } = this.props
    const formData = { category_id: this.state.categoryId }

    return (
      <Modal
        width={600}
        footerClassName={styles.footer}
        {...rest}
        onOk={this.adjustCategory}
        onCancel={this.onCancel}
      >
        <Form
          className={styles.form}
          data={formData}
          ref={form => {
            this.formRef = form
          }}
        >
          <Form.Item
            label={t('Adjust App Category')}
            desc={t('ADJUST_CATEGORY_DESC')}
          >
            <Select
              name="category_id"
              options={this.categories}
              value={this.state.categoryId}
              onChange={this.handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
