import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import classnames from 'classnames'

import { Alert } from '@kube-design/components'
import { Modal } from 'components/Base'
import widthBack from 'components/Modals/WithBack'

import collectionConfig from './config'

import styles from './index.scss'

export default class CreateLogCollectionModal extends Component {
  static propTypes = {
    store: PropTypes.object,
    detail: PropTypes.object,
    visible: PropTypes.bool,
    isSubmitting: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    isSubmitting: false,
    onOk() {},
    onCancel() {},
  }

  collectionMap = Object.entries(collectionConfig).reduce(
    (configs, [type, config]) => ({
      ...configs,
      [type]: {
        Form: widthBack(config.Form),
      },
    }),
    {}
  )

  formRef = React.createRef()

  state = {
    collectionType: '',
  }

  selectCollectionType = e => {
    this.setState(
      {
        collectionType: e.currentTarget.dataset.type,
      },
      () => {
        const validator = get(
          collectionConfig,
          `${this.state.collectionType}.validator`
        )
        this.formRef.current.setCustomValidator(validator)
      }
    )
  }

  handleSubmit = data => {
    this.props.onOk({
      ...data,
      ...{ Name: this.state.collectionType },
    })
  }

  returnToSelectTypeForm = () => {
    this.setState({
      collectionType: '',
    })
  }

  hasCollectionType(type) {
    return this.props.store.list.data.find(
      collection => collection.type === type
    )
  }

  render() {
    const { title, ...rest } = this.props
    const { collectionType } = this.state
    return (
      <Modal.Form
        {...rest}
        icon="clock"
        width={691}
        title={title}
        formRef={this.formRef}
        onOk={this.handleSubmit}
        bodyClassName={styles.body}
        disableOk={collectionType === ''}
      >
        {this.renderContent()}
      </Modal.Form>
    )
  }

  renderContent() {
    const { collectionType } = this.state
    const CreateForm = get(this.collectionMap, `${collectionType}.Form`)
    const title = get(collectionConfig, `${collectionType}.title`)

    return CreateForm ? (
      <CreateForm
        wrapperTitle={title}
        wrapperOnBack={this.returnToSelectTypeForm}
      />
    ) : (
      this.renderFormSelector()
    )
  }

  renderFormSelector() {
    return (
      <div>
        <Alert
          className="margin-b12"
          type="info"
          message={t('LOG_COLLECTION_TIPS')}
        />
        <div className={styles.items}>{this.renderFormSelectorItems()}</div>
      </div>
    )
  }

  renderFormSelectorItems() {
    return Object.entries(collectionConfig).map(
      ([type, { ICON, ...summery }]) => (
        <div
          key={type}
          data-type={type}
          className={classnames(
            styles.collectionType,
            this.hasCollectionType(type) && styles.disabled
          )}
          onClick={
            this.hasCollectionType(type) ? null : this.selectCollectionType
          }
        >
          <div>
            <ICON width={40} height={40} />
          </div>
          <div>
            <h3>{summery.title}</h3>
            <p>{summery.description}</p>
          </div>
        </div>
      )
    )
  }
}
