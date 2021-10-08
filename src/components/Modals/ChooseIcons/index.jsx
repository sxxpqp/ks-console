/* eslint-disable guard-for-in */
import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Modal } from 'components/Base'
// import { Input } from 'antd'
// import { getNodes } from 'api/apply'
import * as Icons from '@ant-design/icons'
import styles from './index.scss'
import { iconsArr } from './icons'

@observer
export default class ChooseIconModal extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    isSubmitting: false,
    detail: {},
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)
    this.state = {
      icon: '',
    }
  }

  componentDidMount() {}

  handleOk() {
    const { onOk } = this.props
    onOk(this.state.icon)
  }

  render() {
    const {
      detail,
      visible,
      onCancel,
      isSubmitting,
      icon = '',
      title = '查看详情',
    } = this.props

    return (
      <Modal.Form
        width={691}
        title={title}
        icon={icon}
        data={detail}
        onOk={this.handleOk.bind(this)}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        visible={visible}
      >
        <div className={styles.icons}>
          {iconsArr.map(i =>
            React.createElement(Icons[i], {
              style: {
                fontSize: '18px',
              },
              className: this.state.icon === i ? styles.active : '',
              onClick: () => {
                this.setState({
                  icon: i,
                })
              },
            })
          )}
        </div>
      </Modal.Form>
    )
  }
}
