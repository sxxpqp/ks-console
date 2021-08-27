import React from 'react'
import { Button, Popper } from '@kube-design/components'

import { PropertiesInput } from 'components/Inputs'
import NodeSelect from './NodeSelect/index'
import styles from './index.scss'

export default class SelectorsInput extends React.Component {
  state = {
    visible: false,
  }

  handleNodeSelect = labels => {
    const { onChange } = this.props
    onChange && onChange(labels)
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  renderNodeSelectForm() {
    const { cluster, namespace } = this.props
    return (
      <NodeSelect
        cluster={cluster}
        namespace={namespace}
        onSelect={this.handleNodeSelect}
        onCancel={this.handleCancel}
        visible={this.state.visible}
      />
    )
  }

  render() {
    const { visible } = this.state

    return (
      <div className={styles.wrapper}>
        <PropertiesInput {...this.props} controlled />
        <Popper
          className={styles.popper}
          visible={visible}
          placement="right"
          content={this.renderNodeSelectForm()}
          closeAfterClick={false}
          trigger="click"
        >
          <Button className={styles.node}>{t('Specify Node')}</Button>
        </Popper>
      </div>
    )
  }
}
