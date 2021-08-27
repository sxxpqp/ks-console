import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { get, set, pick, debounce, cloneDeep } from 'lodash'
import { Columns, Column } from '@kube-design/components'
import { Modal } from 'components/Base'

import AppBaseEdit from 'apps/components/Forms/AppBaseEdit'
import ScreenshotsEdit from 'apps/components/Cards/ScreenshotsEdit'
import ReadmeEdit from 'apps/components/Cards/ReadmeEdit'

import CategoryStore from 'stores/openpitrix/category'
import FileStore from 'stores/openpitrix/file'

import styles from './index.scss'

@observer
export default class AppEdit extends Component {
  static propTypes = {
    store: PropTypes.object,
    detail: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    store: {},
    detail: {},
    visible: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.store = this.props.store
    this.categoryStore = new CategoryStore()
    this.fileStore = new FileStore()

    this.formRef = React.createRef()

    this.state = {
      detail: cloneDeep(toJS(this.props.detail)),
      oldScreenshots: get(this.props.detail, 'screenshots'),
    }
  }

  componentDidMount() {
    this.categoryStore.fetchList({ noLimit: true })
  }

  handleAppChange = debounce((value, name) => {
    const { detail } = this.state
    const newDetail = cloneDeep(detail)
    set(newDetail, name, value)
    this.setState({
      detail: newDetail,
    })
  }, 200)

  handleOk = async () => {
    const formData = pick(this.state.detail, [
      'app_id',
      'name',
      'abstraction',
      'description',
      'home',
      'category_id',
      'readme',
      'workspace',
    ])

    const form = this.formRef.current
    form && form.validate(() => this.props.onOk(formData))
  }

  onCancel = () => {
    const screenshots = this.state.oldScreenshots
    this.handleAppChange(screenshots, 'screenshots')
    this.props.onCancel()
  }

  render() {
    const { visible, isSubmitting, onCancel, ...rest } = this.props
    const categories = toJS(get(this.categoryStore, 'list.data', []))
    const { detail } = this.state

    return (
      <Modal
        {...rest}
        className={styles.modal}
        bodyClassName={styles.body}
        onOk={this.handleOk}
        onCancel={this.onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
        fullScreen
      >
        <Columns className="height-full is-gapless">
          <Column className="is-narrow">
            <AppBaseEdit
              store={this.store}
              formData={detail}
              categories={categories}
              fileStore={this.fileStore}
              formRef={this.formRef}
              handleChange={this.handleAppChange}
            />
          </Column>
          <Column>
            <ScreenshotsEdit
              handleChange={this.handleAppChange}
              store={this.store}
              detail={detail}
              fileStore={this.fileStore}
            />
            <ReadmeEdit
              handleChange={this.handleAppChange}
              store={this.store}
              detail={detail}
            />
          </Column>
        </Columns>
      </Modal>
    )
  }
}
