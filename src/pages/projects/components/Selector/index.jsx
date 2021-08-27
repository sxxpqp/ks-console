import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Tag, Tooltip } from '@kube-design/components'
import SelectModal from 'components/Modals/ProjectSelect'

import styles from './index.scss'

export default class Selector extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    type: 'projects',
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

  handleSelect = value => {
    const { onChange } = this.props
    this.hideSelect()
    onChange(value)
  }

  render() {
    const { title, type, detail, isFederated } = this.props
    const { name, description, cluster, workspace } = detail
    const { showSelect } = this.state

    return (
      <div>
        <div className={styles.titleWrapper} onClick={this.showSelect}>
          <div className={styles.icon}>
            <Icon
              name={type === 'devops' ? 'strategy-group' : 'project'}
              size={40}
              type="light"
            />
          </div>
          <div className={styles.text}>
            <Tooltip content={name}>
              <div className="h6">{name}</div>
            </Tooltip>
            <p>{description || title}</p>
          </div>
          {isFederated && (
            <Tag className={styles.tag} type="info">
              {t('MULTI_CLUSTER')}
            </Tag>
          )}
        </div>
        <SelectModal
          defaultType={type}
          cluster={cluster}
          workspace={workspace || this.props.workspace}
          visible={showSelect}
          onChange={this.handleSelect}
          onCancel={this.hideSelect}
        />
      </div>
    )
  }
}
