import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { get } from 'lodash'

import { Modal } from 'components/Base'

import Department from './Department'
import Detail from './Detail'

import styles from './index.scss'

@observer
export default class EditGroupModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
  }

  constructor(props) {
    super(props)
    this.store = props.store
    this.state = {
      showForm: false,
      groupId: '',
      treeNodeId: 'root',
    }
  }

  componentDidMount() {
    const { treeData } = this.props
    if (get(treeData[0], 'children').length > 0) {
      this.setState({
        groupId: treeData[0].group_id,
      })
    } else {
      this.setState({ showForm: true })
    }
  }

  toggleForm = () => {
    this.setState(({ showForm }) => ({
      showForm: !showForm,
    }))
  }

  handleSelect = keys => {
    this.setState({
      showForm: false,
      groupId: keys[0],
      treeNodeId: keys[0],
    })
  }

  handleTreeNodeIdChange = id => {
    this.setState({
      treeNodeId: id,
    })
  }

  render() {
    const { visible, title, onCancel, treeData } = this.props
    const { showForm, groupId, treeNodeId } = this.state

    return (
      <Modal
        width={1162}
        title={title}
        closable={false}
        cancelText={t('Close')}
        visible={visible}
        onCancel={onCancel}
        bodyClassName={styles.modalBody}
        footerClassName={styles.modalFooter}
      >
        <div className={styles.content}>
          <Department
            treeData={treeData}
            groupId={this.groupId}
            onSelect={this.handleSelect}
          />
          <Detail
            {...this.props}
            showForm={showForm}
            toggleForm={this.toggleForm}
            onChange={this.handleTreeNodeIdChange}
            groupId={groupId}
            treeNodeId={treeNodeId}
          />
        </div>
      </Modal>
    )
  }
}
