import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@kube-design/components'

import SelectModal from 'clusters/components/Modals/ClusterSelect'

import styles from './index.scss'

export default class Selector extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    value: '',
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
    const { value } = this.props
    const { showSelect } = this.state

    return (
      <div>
        <div
          className={styles.titleWrapper}
          onClick={globals.app.isMultiCluster ? this.showSelect : null}
        >
          <div className={styles.icon}>
            <Icon name="cluster" size={40} type="light" />
          </div>
          <div className={styles.text}>
            <div className="h6">{value}</div>
            <p>{t('Cluster Management')}</p>
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
