import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Icon, Tooltip } from '@kube-design/components'

import SelectModal from 'workspaces/components/Modals/WorkspaceSelect'

import styles from './index.scss'

export default class Selector extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    detail: {},
    onChange() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      showSelect: false,
    }
  }

  showSelect = () => {
    this.setState({ showSelect: true })
  }

  hideSelect = () => {
    this.setState({ showSelect: false })
  }

  handleSelect = workspace => {
    const { onChange } = this.props
    this.hideSelect()
    onChange(workspace)
  }

  render() {
    const { detail } = this.props
    const { showSelect } = this.state

    return (
      <div>
        <div
          className={classNames(styles.titleWrapper, 'pointer')}
          onClick={this.showSelect}
        >
          <div className={styles.icon}>
            <Icon name="enterprise" size={40} type="light" />
          </div>
          <div className={styles.text}>
            <Tooltip content={detail.name}>
              <div className="h6">{detail.name}</div>
            </Tooltip>
            <p>{detail.description || t('Workspace')}</p>
          </div>
        </div>
        <SelectModal
          visible={showSelect}
          onChange={this.handleSelect}
          onCancel={this.hideSelect}
        />
      </div>
    )
  }
}
