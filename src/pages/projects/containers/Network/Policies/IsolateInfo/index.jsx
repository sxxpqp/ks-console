import React from 'react'
import { Icon } from '@kube-design/components'
import classNames from 'classnames'
import { ICON_TYPES } from 'utils/constants'
import styles from './index.scss'

export default class IsolateInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: props.networkIsolate,
    }
  }

  toggle = () => {
    const { opened } = this.state
    this.props.onEdit(!opened)
    this.setState({
      opened: !opened,
    })
  }

  render() {
    const { opened } = this.state
    const { module, canEdit } = this.props
    return (
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <Icon
            name={ICON_TYPES[module]}
            size={40}
            color={{
              primary: '#324558',
              secondary: '#f5a623',
            }}
          />
          <div className={styles.isolate}>
            <div className={styles.isolatetitle}>{t('On')}</div>
            <div>{t('NETWORK_POLICY_STATUS')}</div>
          </div>
        </div>
        {canEdit && (
          <div
            className={classNames(styles.toggle, opened ? '' : styles.closed)}
            onClick={this.toggle}
          >
            <span>{opened ? t('On') : t('Close')}</span>
            <label className={styles.toggleop} />
          </div>
        )}
      </div>
    )
  }
}
