import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import { observer } from 'mobx-react'
import { Modal } from 'components/Base'
import CodeEditor from 'components/Base/CodeEditor'

import styles from './index.scss'

@observer
export default class Shell extends React.Component {
  static propTypes = {
    name: PropTypes.string,
  }

  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)
    this.state = { value: '' }
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.edittingData.type === 'sh') {
      const value = get(nextProps.edittingData.data, '[0].value.value', '')

      return { value }
    }
    return null
  }

  handleChange = value => {
    this.newValue = value
  }

  handleOk = () => {
    this.props.onAddStep({
      name: 'sh',
      arguments: [
        {
          key: 'script',
          value: { isLiteral: true, value: this.newValue || '' },
        },
      ],
    })
  }

  render() {
    const { visible, onCancel } = this.props
    const { value } = this.state

    return (
      <Modal
        width={680}
        bodyClassName={styles.body}
        onCancel={onCancel}
        onOk={this.handleOk}
        visible={visible}
        closable={false}
        title={t('shell')}
      >
        <CodeEditor
          className={styles.CodeEditor}
          name="script"
          mode="yaml"
          value={value}
          onChange={this.handleChange}
        />
      </Modal>
    )
  }
}
