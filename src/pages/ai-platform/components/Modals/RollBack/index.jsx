import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { sortBy, get } from 'lodash'

import { getCurrentRevision } from 'utils/workload'

import { Form, Input, Select } from '@kube-design/components'
import { Modal } from 'components/Base'
import RevisionStore from 'stores/workload/revision'

@observer
export default class RollBackModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    detail: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    detail: {},
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.revisionStore = new RevisionStore(props.store.module)

    this.form = React.createRef()
  }

  get revisions() {
    const { data, isLoading } = this.revisionStore.list
    return isLoading ? [] : data
  }

  get curRevision() {
    const { store, detail } = this.props

    return getCurrentRevision(detail, this.revisions, store.module)
  }

  componentDidMount() {
    if (this.props.visible) {
      this.fetchData(this.props.detail)
    }
  }

  fetchData = detail => {
    this.revisionStore.fetchList(detail)
  }

  getFormData = () => {
    const { name } = this.props.detail

    return {
      name,
      currentRevision: `#${this.curRevision}`,
    }
  }

  getRevisionOps = () => {
    const revisions = sortBy(this.revisions, item =>
      parseInt(item.revision, 10)
    )

    return revisions
      .map(({ revision }) => ({
        label: `#${revision}`,
        value: Number(revision),
      }))
      .filter(item => item.value !== this.curRevision)
  }

  handleOk = () => {
    const { detail, store, onOk } = this.props
    if (this.form && this.form.current) {
      const form = this.form.current
      form &&
        form.validate(() => {
          const formData = form.getData()

          const revision = this.revisions.find(
            item => Number(item.revision) === formData.revision
          )

          let data
          if (store.module === 'deployments') {
            data = [
              {
                op: 'replace',
                path: '/spec/template',
                value: toJS(get(revision, 'spec.template')),
              },
              {
                op: 'replace',
                path: '/metadata/annotations',
                value: detail.annotations,
              },
            ]
          } else {
            data = {
              spec: {
                template: {
                  $patch: 'replace',
                  ...toJS(get(revision, 'spec.template')),
                },
              },
            }
          }

          onOk(data)
        })
    }
  }

  render() {
    const { visible, onCancel, isSubmitting } = this.props
    const formData = this.getFormData()

    return (
      <Modal.Form
        formRef={this.form}
        data={formData}
        width={691}
        title={t('Revision Rollback')}
        icon="timed-task"
        onOk={this.handleOk}
        onCancel={onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
      >
        <Form.Item label={t('Resource Name')}>
          <Input name="name" disabled />
        </Form.Item>
        <Form.Item label={t('Current Revision')}>
          <Input name="currentRevision" disabled />
        </Form.Item>
        <Form.Item
          label={t('Rollback Revisions')}
          rules={[
            {
              required: true,
              message: t('Please select rollback revision'),
            },
          ]}
        >
          <Select
            name="revision"
            placeholder={t('REVISION_ROLLBACK_SELECT')}
            options={this.getRevisionOps()}
          />
        </Form.Item>
      </Modal.Form>
    )
  }
}
