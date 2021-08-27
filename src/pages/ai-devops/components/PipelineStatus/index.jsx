import React from 'react'
import { observer } from 'mobx-react'
import { isEmpty } from 'lodash'
import { observable, action, toJS } from 'mobx'

import PropTypes from 'prop-types'
import { Dragger } from 'components/Base'
import ParamsFormModal from 'components/Forms/Pipelines/ParamsFormModal'

import PipelineNodes from './nodesRender'
import style from './index.scss'

@observer
export default class PipelineStatus extends React.Component {
  constructor(props) {
    super(props)
    this.draggerCref = React.createRef()
  }

  @observable
  isUserMoved = false

  @observable
  parameters = []

  @observable
  showParamsModal = false

  componentDidUpdate() {
    if (this.draggerCref.current && !this.draggerCref.current.isMoved) {
      this.draggerCref.current.initialComponent &&
        this.draggerCref.current.initialComponent()
    }
  }

  @action
  handleRefresh = () => {
    this.scale = 1
    this.translateX = 0
    this.translateY = 0
  }

  static contextTypes = {
    onProceed: PropTypes.func,
    onBreak: PropTypes.func,
  }

  @action
  handleProceed = async (parameters, cb) => {
    await this.context.onProceed(
      { parameters, ...this.elseParams },
      typeof cb === 'function' ? cb : undefined
    )
    this.showParamsModal = false
  }

  handelShowProceedModal = ({ parameters, ...elseParams }, callBack) => {
    this.parameters = parameters
    this.elseParams = elseParams
    if (isEmpty(parameters)) {
      this.handleProceed(parameters, callBack)
      return
    }
    this.showParamsModal = true
  }

  hideProceedModal = () => {
    this.showParamsModal = false
  }

  render() {
    const { isEditMode, jsonData } = this.props

    return (
      <React.Fragment>
        <Dragger
          ref={this.draggerCref}
          className={style.container}
          enableToggleFullScreen={true}
          XOffset={30}
          YOffset={60}
        >
          <PipelineNodes
            isEditMode={isEditMode}
            stages={jsonData}
            onProceed={this.handelShowProceedModal}
            onBreak={this.context.onBreak}
          />
        </Dragger>
        <ParamsFormModal
          visible={this.showParamsModal}
          parameters={toJS(this.parameters)}
          onCancel={this.hideProceedModal}
          onOk={this.handleProceed}
        />
      </React.Fragment>
    )
  }
}
