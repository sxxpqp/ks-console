import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { observer } from 'mobx-react'

import VolumeStore from 'stores/volume'

import { Panel } from 'components/Base'

import { joinSelector } from 'utils'

import VolumeItem from './Item'

import styles from './index.scss'

@observer
export default class VolumesCard extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    selector: PropTypes.object,
  }

  static defaultProps = {
    className: '',
  }

  store = new VolumeStore()

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
    const { data } = this.store.list

    if (isEmpty(data)) return null

    return (
      <div className={styles.content}>
        {data.map((item, index) => (
          <VolumeItem key={index} volume={item} prefix={prefix} />
        ))}
      </div>
    )
  }

  render() {
    const { className, title } = this.props

    const content = this.renderContent()

    if (!content) {
      return null
    }

    return (
      <Panel className={className} title={title || t('Volumes')}>
        {content}
      </Panel>
    )
  }
}
