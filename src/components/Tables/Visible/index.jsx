import React from 'react'
import classnames from 'classnames'
import { computed, action } from 'mobx'
import { observer } from 'mobx-react'
import { isUndefined, get } from 'lodash'

import List from 'react-virtualized/dist/es/List/List'
import AutoSizer from 'react-virtualized/dist/es/AutoSizer/AutoSizer'
import CellMeasurerCache from 'react-virtualized/dist/es/CellMeasurer/CellMeasurerCache'
import CellMeasurer from 'react-virtualized/dist/es/CellMeasurer/CellMeasurer'

import { Icon, Dropdown } from '@kube-design/components'
import styles from './index.scss'

@observer
export default class VisibleTable extends React.Component {
  static defaultProps = {
    defaultRowHeight: 32,
  }

  @computed
  get dropDownCols() {
    return this.props.cols.filter(col => !col.mustShow)
  }

  @computed
  get visibleCol() {
    return this.props.cols.filter(col => !col.hidden)
  }

  measureCache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: this.props.defaultRowHeight,
  })

  componentDidUpdate() {
    this.clearMeasurerCache()
  }

  clearMeasurerCache = () => {
    this.measureCache.clearAll()
  }

  onTrClick = ({ target, currentTarget }) => {
    const itemNodeIndex = (function findItemNodeIndex(node) {
      const itemIndex = get(node, 'dataset.itemIndex')
      if (node === currentTarget) {
        return
      }

      return isUndefined(itemIndex)
        ? findItemNodeIndex(node.parentNode)
        : itemIndex
    })(target)

    if (isUndefined(itemNodeIndex)) {
      return
    }
    const data = this.props.data[itemNodeIndex]
    this.props.onTrClick(data)
  }

  @action
  toggleCol = e => {
    const index = e.currentTarget.dataset.index
    const item = this.dropDownCols[index]
    item.hidden = !item.hidden
    this.clearMeasurerCache()
  }

  render() {
    const { data, body: bodyClassName, tableRef, onScroll } = this.props
    const dataLength = data.length
    return (
      <div className={styles.table}>
        {this.renderTitle()}
        <div
          className={classnames(styles.body, bodyClassName)}
          onClick={this.onTrClick}
        >
          <AutoSizer onResize={this.CellMeasurerCache}>
            {({ width, height }) => (
              <List
                ref={tableRef}
                width={width}
                height={height}
                overscanRowCount={10}
                rowRenderer={this.renderItem}
                onScroll={onScroll}
                rowCount={dataLength}
                rowHeight={this.measureCache.rowHeight}
                deferredMeasurementCache={this.measureCache}
                // the props below are only use to trigger List update
                data={data}
                visibleCol={this.visibleCol}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    )
  }

  renderTitle() {
    return (
      <div className={classnames(styles.header, this.props.header)}>
        {this.visibleCol.map(col => (
          <div
            key={col.key}
            className={classnames(styles.headerItems, col.className)}
          >
            {col.thead}
          </div>
        ))}
        <div className={styles.visibleBtn}>
          <Dropdown
            content={this.renderDropdownContent()}
            onOpen={this.handleOpen}
            onClose={this.handleClose}
          >
            <div>
              {t('Display Content')} <Icon name="cogwheel" />
            </div>
          </Dropdown>
        </div>
      </div>
    )
  }

  renderDropdownContent = () => (
    <div className={styles.dropdown}>
      <h3>{t('Display Content')}</h3>
      {this.dropDownCols.map((col, index) => (
        <div
          key={col.thead}
          className={styles.visibleItem}
          data-index={index}
          onClick={this.toggleCol}
        >
          <Icon name={col.hidden ? 'eye-closed' : 'eye'} />
          <span>{col.thead}</span>
        </div>
      ))}
    </div>
  )

  renderItem = ({ index, key, parent, style }) => {
    const data = this.props.data[index] || {}
    return (
      <CellMeasurer
        key={key}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
        cache={this.measureCache}
      >
        <div style={style}>
          <div
            data-item-index={index}
            className={classnames(styles.tr, this.props.trCLassName)}
          >
            {this.visibleCol.map(col => (
              <div
                key={col.key}
                className={classnames(styles.bodyItems, col.className)}
              >
                {col.content(data)}
              </div>
            ))}
          </div>
        </div>
      </CellMeasurer>
    )
  }
}
