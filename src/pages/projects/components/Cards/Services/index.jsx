import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { observer } from 'mobx-react'
import { Loading } from '@kube-design/components'

import { Panel } from 'components/Base'
import ServiceStore from 'stores/service'
import { joinSelector } from 'utils'

import Item from './Item'

import styles from './index.scss'

@observer
export default class ServicesCard extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    prefix: PropTypes.string,
    selector: PropTypes.object,
  }

  static defaultProps = {
    prefix: '',
    selector: {},
  }

  store = new ServiceStore()

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    const { selector, cluster, namespace } = this.props
    if (!isEmpty(selector)) {
      this.store.fetchListByK8s({
        cluster,
        namespace,
        labelSelector: joinSelector(selector),
      })
    }
  }

  renderContent() {
    const { prefix } = this.props
    const { data, isLoading } = this.store.list

    if (isEmpty(data) && !isLoading) {
      return (
        <div className={styles.empty}>
          {t('NOT_AVAILABLE', { resource: t('Service') })}
        </div>
      )
    }

    return (
      <Loading spinning={isLoading}>
        <div className={styles.content}>
          {data.map(item => (
            <Item key={item.uid} prefix={prefix} detail={item} />
          ))}
        </div>
      </Loading>
    )
  }

  render() {
    const { className } = this.props

    return (
      <Panel className={className} title={t('Services')}>
        {this.renderContent()}
      </Panel>
    )
  }
}
