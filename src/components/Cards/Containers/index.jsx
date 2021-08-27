import React from 'react'
import PropTypes from 'prop-types'

import { Panel } from 'components/Base'
import ContainerItem from './Item'

import styles from './index.scss'

export default class ContainersCard extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    prefix: PropTypes.string,
    title: PropTypes.string,
    containers: PropTypes.array,
    initContainers: PropTypes.array,
  }

  static defaultProps = {
    prefix: '',
    containers: [],
    initContainers: [],
  }

  render() {
    const {
      className,
      prefix,
      cluster,
      containers,
      initContainers,
      podName,
    } = this.props
    const title = this.props.title || t('Container Config')

    return (
      <Panel className={className} title={title}>
        <div className={styles.wrapper}>
          {containers.map((item, index) => (
            <ContainerItem
              key={index}
              prefix={prefix}
              cluster={cluster}
              detail={item}
              podName={podName}
            />
          ))}
          {initContainers.map((item, index) => (
            <ContainerItem
              key={index}
              prefix={prefix}
              cluster={cluster}
              detail={item}
              podName={podName}
              isInit
            />
          ))}
        </div>
      </Panel>
    )
  }
}
