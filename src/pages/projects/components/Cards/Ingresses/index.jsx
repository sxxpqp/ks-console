import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { isEmpty } from 'lodash'
import { Panel } from 'components/Base'

import { joinSelector } from 'utils'

import RouteStore from 'stores/router'

import Item from './Item'

@observer
export default class Routes extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    prefix: PropTypes.string,
    selector: PropTypes.object,
    title: PropTypes.string,
  }

  static defaultProps = {
    prefix: '',
  }

  store = new RouteStore()

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    const { cluster, namespace, selector } = this.props

    if (!isEmpty(selector)) {
      const params = {
        cluster,
        namespace,
        labelSelector: joinSelector(selector),
      }

      this.store.getGateway({ cluster, namespace })
      this.store.fetchListByK8s(params)
    }
  }

  renderContent() {
    const { prefix } = this.props
    const { data } = this.store.list
    const gateway = this.store.gateway.data

    if (isEmpty(data)) {
      return null
    }

    return data.map(item => (
      <Item key={item.name} prefix={prefix} detail={item} gateway={gateway} />
    ))
  }

  render() {
    const { className, title } = this.props

    const content = this.renderContent()

    if (!content) {
      return null
    }

    return (
      <Panel className={className} title={title || t('Routes')}>
        {content}
      </Panel>
    )
  }
}
