import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { set, get, cloneDeep } from 'lodash'

import { Loading } from '@kube-design/components'

import Tree from 'components/Tree'

import styles from './index.scss'

@observer
export default class GroupTree extends Component {
  static propTypes = {
    treeData: PropTypes.array,
    total: PropTypes.number,
    isLoading: PropTypes.bool,
    onSelect: PropTypes.func,
  }

  renderTree = () => {
    const { treeData, onSelect, group } = this.props
    const data = set(cloneDeep(treeData)[0], 'disabled', true)
    const defaultKey = get(treeData[0].children[0], 'key', 'root')

    return (
      <div className={styles.treeWrapper}>
        <Tree
          showLine
          defaultExpandedKeys={[defaultKey]}
          defaultSelectedKeys={[defaultKey]}
          treeData={data}
          selectedKeys={[group]}
          onSelect={onSelect}
        />
      </div>
    )
  }

  renderPlaceHolder = () => {
    return <div className={styles.empty}>{t('WORKSPACE_GROUP_EMPTY_DESC')}</div>
  }

  render() {
    const { isLoading, total } = this.props

    return (
      <div className={styles.wrapper}>
        {isLoading && (
          <div className={styles.loading}>
            <Loading spinning={isLoading} />
          </div>
        )}
        {total === 0 && !isLoading && this.renderPlaceHolder()}
        {total > 0 && this.renderTree()}
      </div>
    )
  }
}
