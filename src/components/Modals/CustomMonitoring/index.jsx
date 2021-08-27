import React from 'react'
import { Provider, observer } from 'mobx-react'

import LabelStore from 'stores/monitoring/custom/labelsets'

/**
 * All containers dependent CustomMonitoringStore and modalStore
 */
import SwitchButton from './containers/SwitchButton'
import Title from './containers/Title'
import RefreshIntervalSelector from './containers/RefreshIntervalSelector'
import TimeRangeSelect from './containers/TimeRangeSelect'
import TextContainer from './containers/TextContainer'
import MonitorEditor from './containers/MonitorEditor'
import GraphOverview from './containers/GraphOverview'
import ThemeSwitchButton from './containers/ThemeSwitchButton'

import Clock from './components/Clock'
import Modal from './components/Modal/Theme'
import Layout from './components/Layout'

import ModalStore from './store'

/**
 * A container modal to handle custom monitoring template
 */
@observer
export default class CustomMonitoringModal extends React.Component {
  /**
   * store remote data
   */
  store = this.props.store

  /**
   * store temporary data
   */
  modalStore = new ModalStore()

  labelStore = new LabelStore()

  subForm = React.createRef()

  handleSave = data => {
    const { onOk } = this.props

    if (this.subForm && this.subForm.current) {
      this.subForm.current.handleSubmit()
    }

    onOk(data)
  }

  render() {
    const { readOnly, onCancel, isSubmitting } = this.props
    const hasSelectedMonitor = this.modalStore.selectedMonitor
    const isEditing = this.store.isEditing

    const shouldMonitorDeatilShow = hasSelectedMonitor && isEditing

    return (
      <Provider
        monitoringStore={this.store}
        labelStore={this.labelStore}
        modalStore={this.modalStore}
      >
        <Modal
          theme={this.modalStore.theme}
          onCancel={onCancel}
          title={<Title />}
          description={<Clock />}
          operations={
            <>
              <ThemeSwitchButton />
              <TimeRangeSelect />
              <RefreshIntervalSelector />
              {!readOnly && (
                <SwitchButton
                  onSaveClick={this.handleSave}
                  isSubmitting={isSubmitting}
                />
              )}
            </>
          }
        >
          <Layout
            sidebar={<TextContainer />}
            content={
              shouldMonitorDeatilShow ? (
                <MonitorEditor ref={this.subForm} />
              ) : (
                <GraphOverview />
              )
            }
          />
        </Modal>
      </Provider>
    )
  }
}
