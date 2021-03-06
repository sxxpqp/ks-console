import React from 'react'
import { observable, action, computed, toJS } from 'mobx'
import { observer } from 'mobx-react'
import Card from './Card'
import Edges from './Edges'

@observer
export default class PipelineNodes extends React.Component {
  static defaultProps = {}

  @observable
  heights = []

  @computed
  get sumHeights() {
    const { stages = [] } = this.props

    return this.heights.slice(0, stages.length).map(height => {
      let tempHeight = 0
      return height.map(_height => {
        tempHeight += _height
        return tempHeight
      })
    })
  }

  handleAddBranch = index => () => {
    this.props.store.handleAddBranch(index)
  }

  onInsertColumn = index => {
    this.props.store.insertColumn(index)
  }

  handleFocus = index => columnIndex => {
    this.props.store.setFocus(index, columnIndex)
  }

  @action
  onAddStep = () => {
    this.props.store.isAddingStep = true
  }

  @action
  setHeight = index => heights => {
    const _heights = [...this.heights]
    _heights[index] = heights
    this.heights = _heights
  }

  render() {
    const { stages, isEditMode } = this.props

    if (!stages.length && isEditMode) {
      return (
        <Edges
          onInsertColumn={this.onInsertColumn}
          isEditMode={isEditMode}
          index={-1}
          heights={[]}
        />
      )
    }
    return (
      <React.Fragment>
        <Edges
          onInsertColumn={this.onInsertColumn}
          isEditMode={isEditMode}
          index={-1}
          heights={this.sumHeights}
        />
        {stages.map((stage, index) => (
          <React.Fragment key={`${stage.name}${index}`}>
            <Card
              onAddBranch={this.handleAddBranch(index)}
              onAddStep={this.onAddStep}
              isEditMode={isEditMode}
              nodes={toJS(stage)}
              index={index}
              setHeight={this.setHeight(index)}
              onFocus={this.handleFocus(index)}
            />
            <Edges
              onInsertColumn={this.onInsertColumn}
              isEditMode={isEditMode}
              index={index}
              heights={this.sumHeights}
            />
          </React.Fragment>
        ))}
      </React.Fragment>
    )
  }
}
