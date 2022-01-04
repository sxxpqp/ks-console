import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import {
  Form,
  Input,
  // Select, TextArea
} from '@kube-design/components'
import { Modal } from 'components/Base'
import { Tag } from 'antd'

@observer
export default class AuditDetailModal extends React.Component {
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

  // constructor(props) {
  //   super(props)

  // }

  handleOk = data => {
    const { onOk } = this.props
    onOk(data)
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

    let tips
    const { status } = detail
    switch (status) {
      case 0:
        tips = <Tag color="processing">未审核</Tag>
        break
      case 1:
        tips = <Tag color="success">已审核</Tag>
        break
      case 2:
        tips = <Tag color="error">已驳回</Tag>
        break
      default:
        tips = <Tag color="processing">未审核</Tag>
    }

    return (
      <Modal.Form
        width={691}
        title={title}
        icon={icon}
        data={detail}
        onOk={this.handleOk}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        visible={visible}
      >
        <Form.Item
          label={'CPU'}
          desc={'用户选择的CPU核心数'}
          // rules={[
          //   { required: true, message: t('Please input name') },
          //   { pattern: PATTERN_NAME, message: t('PATTERN_NAME_INVALID_TIP') },
          // ]}
        >
          <Input name="cpu" disabled />
        </Form.Item>
        <Form.Item label={'内存'} desc={'用户选择的内存大小（单位GiB）'}>
          <Input name="mem" disabled />
        </Form.Item>
        <Form.Item label={'磁盘大小'} desc={'用户选择的磁盘大小（单位GiB）'}>
          <Input name="disk" disabled />
        </Form.Item>
        <Form.Item label={'GPU'} desc={'用户选择的GPU核心数'}>
          <Input name="gpu" disabled />
        </Form.Item>
        <Form.Item label={'申请理由'}>
          <Input name="reason" disabled />
        </Form.Item>
        <Form.Item label={'状态'}>
          <span>{tips}</span>
        </Form.Item>
        {detail.msg && (
          <Form.Item label={detail.type === 2 ? '驳回理由' : '审核消息'}>
            <span>{detail.msg}</span>
          </Form.Item>
        )}
      </Modal.Form>
    )
  }
}
