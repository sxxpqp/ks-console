import { isUndefined } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import classNames from 'classnames'
import { Modal } from 'components/Base'
import EditMode from 'components/EditMode'

import styles from './index.scss'

export default class YamlEditModal extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    yaml: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
    readOnly: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    isSubmitting: false,
    readOnly: false,
    detail: {},
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      value: props.store ? null : props.detail,
    }

    this.editor = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && !prevProps.visible) {
      this.init(this.props)
    }
  }

  componentDidMount() {
    this.init(this.props)
  }

  init(props) {
    const { yaml, detail, store } = props
    if (yaml) {
      return this.setState({ value: yaml })
    }

    if (detail && detail.name) {
      store.fetchDetail(detail).then(data => {
        this.setState({ value: data._originData })
      })
    }
  }

  handleOk = () => {
    const { onOk, onCancel, store, detail } = this.props

    const value = this.editor.current.getData()
    const list = store.list
    const selectedRowKeys = toJS(list.selectedRowKeys)
    const newSelectedRowKeys = selectedRowKeys
      ? selectedRowKeys.filter(item => item !== detail.uid)
      : ''

    if (isUndefined(value)) {
      onCancel()
    } else {
      onOk(value)
      if (selectedRowKeys) list.setSelectRowKeys(newSelectedRowKeys)
    }
  }

  render() {
    const { readOnly, visible, onCancel, isSubmitting } = this.props
    const title = readOnly ? t('View YAML') : t('Edit YAML')
    const icon = readOnly ? 'eye' : 'pen'

    return (
      <Modal
        icon={icon}
        title={title}
        bodyClassName={classNames({
          [styles.readOnly]: readOnly,
        })}
        onOk={this.handleOk}
        onCancel={onCancel}
        okText={t('Update')}
        visible={visible}
        closable={readOnly}
        hideFooter={readOnly}
        isSubmitting={isSubmitting}
        fullScreen
      >
        {this.state.value && (
          <EditMode
            ref={this.editor}
            editorClassName={styles.editor}
            value={this.state.value}
            readOnly={readOnly}
          />
        )}
      </Modal>
    )
  }
}
