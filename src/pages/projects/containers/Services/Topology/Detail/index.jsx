import React, { Component } from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { Icon } from '@kube-design/components'

import BaseInfo from './BaseInfo'
import Connections from './Connections'
import Childrens from './Childrens'
import Tables from './Tables'

import styles from './index.scss'

@observer
export default class ServiceDetail extends Component {
  static defaultProps = {
    data: {},
  }

  componentDidMount() {
    this.fetchDetail(this.props.data.id)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data.id !== this.props.data.id) {
      this.fetchDetail(this.props.data.id)
    }
  }

  fetchDetail(id) {
    const { store, match } = this.props
    const { cluster, namespace } = match.params
    if (id) {
      store.fetchDetail({
        cluster,
        namespace,
        name: id,
      })
    }
  }

  handleJump = params => {
    this.fetchDetail(params.id)
  }

  render() {
    const { onClose } = this.props
    const { node = {} } = toJS(this.props.store.detail)

    return (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.title}>{node.label}</div>
          <Icon
            className={styles.close}
            name="close"
            type="light"
            size={20}
            clickable
            onClick={onClose}
          />
        </div>
        <div className={styles.content}>
          <BaseInfo detail={node} />
          <Connections detail={node} jumpTo={this.handleJump} />
          <Childrens detail={node} />
          <Tables detail={node} />
        </div>
      </div>
    )
  }
}
