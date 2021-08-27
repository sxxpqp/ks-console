import React from 'react'
import PropTypes from 'prop-types'

import { observer } from 'mobx-react'
import { Modal } from 'components/Base'
import CodeEditor from 'components/Base/CodeEditor'

import styles from './index.scss'

@observer
export default class YamlEditor extends React.Component {
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

  componentDidMount() {
    const { value } = this.props
    this.state.value = value
  }

  static getDerivedStateFromProps(nextProps) {
    const { value } = nextProps
    return { value }
  }

  handleChange = value => {
    this.newValue = value
  }

  handleOk = () => {
    this.props.onOk(this.newValue)
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
        title={t('yaml')}
      >
        <CodeEditor
          className={styles.CodeEditor}
          name="script"
          mode="yaml"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </Modal>
    )
  }
}
