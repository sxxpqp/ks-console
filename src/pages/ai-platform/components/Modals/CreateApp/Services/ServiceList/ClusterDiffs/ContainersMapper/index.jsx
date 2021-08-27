import { get, set, cloneDeep, isEmpty } from 'lodash'
import React, { Component } from 'react'
import classNames from 'classnames'

import styles from './index.scss'

export default class ContainersMapper extends Component {
  getContainer({ index, container, containerType }) {
    const { cluster, formTemplate } = this.props
    const override =
      get(formTemplate, 'spec.overrides', []).find(
        item => item.clusterName === cluster
      ) || {}

    const containerTemplate = cloneDeep(container)

    const prefix = `/spec/template/spec/${
      containerType === 'init' ? 'init_containers' : 'containers'
    }/${index}/`

    if (override && !isEmpty(override.clusterOverrides)) {
      override.clusterOverrides.forEach(item => {
        if (item.path.startsWith(prefix)) {
          const subPath = item.path.replace(prefix, '').replace(/\//g, '.')
          set(containerTemplate, subPath, item.value)
        }
      })
    }

    return containerTemplate
  }

  renderContainer = (container, index, containerType) => {
    const { children, selected } = this.props

    const containerTemplate = this.getContainer({
      container,
      index,
      containerType,
    })

    return (
      <div
        key={container.name}
        className={classNames(styles.wrapper, {
          [styles.selected]: selected,
        })}
      >
        {children({
          ...this.props,
          index,
          key: index,
          containerType: 'worker',
          container: containerTemplate,
        })}
      </div>
    )
  }

  render() {
    const { formTemplate } = this.props

    const containers = get(formTemplate, 'spec.template.spec.containers', [])
    const initContainers = get(
      formTemplate,
      'spec.template.spec.init_containers',
      []
    )

    return (
      <>
        {containers.map((container, index) =>
          this.renderContainer(container, index, 'worker')
        )}
        {initContainers.map((container, index) =>
          this.renderContainer(container, index, 'init')
        )}
      </>
    )
  }
}
