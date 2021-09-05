import React from 'react'
import { inject, observer } from 'mobx-react'
import Banner from 'components/Cards/Banner'
import { Button, Notify } from '@kube-design/components'
import Apps from 'ai-review/components/Apps'
import { Panel } from 'components/Base'
import { Select, InputNumber, Radio, Input, Table } from 'antd'
// import { Radio, Space } from 'antd'

import { applyRes } from 'api/apply'
import styles from './index.scss'

const { TextArea } = Input

const { Option } = Select
@inject('rootStore')
@observer
export default class ApplyDefault extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      key: [],
      defaultApp: '',
      value: 1,
      formData: {
        cpu: null,
        gpu: null,
        mem: null,
        disk: 40,
      },
      isSubmitting: false,
      cpuOptions: [
        1,
        2,
        4,
        8,
        12,
        16,
        20,
        24,
        32,
        40,
        48,
        52,
        64,
        72,
        80,
        96,
        104,
        208,
      ],
      memOptions: [
        1,
        2,
        4,
        8,
        16,
        24,
        32,
        48,
        64,
        88,
        96,
        128,
        176,
        192,
        256,
        288,
        352,
        384,
        512,
        768,
        1536,
        3072,
      ],
      gpuOptions: [0, 1, 2, 4, 8, 12, 16, 20, 24, 32],
      reason: '',
    }

    this.formRef = React.createRef()
  }

  get tips() {
    return [
      {
        title: '资源选择',
        description: t('SERVICE_TYPES_A'),
      },
      {
        title: '应用选择',
        description: t('SCENARIOS_FOR_SERVICES_A'),
      },
    ]
  }

  handlePrev = () => {
    this.setState(({ currentStep }) => ({
      currentStep: Math.max(0, currentStep - 1),
    }))
    // if (this.state.currentStep <= 0) {
    //   this.routing.push(`/apps/${this.appId}`)
    // } else {
    //   this.setState(({ currentStep }) => ({
    //     currentStep: Math.max(0, currentStep - 1),
    //   }))
    // }
  }

  handleNext = () => {
    this.setState(({ currentStep }) => ({
      currentStep: Math.min(this.steps.length - 1, currentStep + 1),
    }))
    // const form = this.formRef.current
    // form &&
    //   form.validate(() => {
    //     this.setState(({ currentStep }) => ({
    //       currentStep: Math.min(this.steps.length - 1, currentStep + 1),
    //     }))
    //   })
  }

  renderRadios() {
    const { value } = this.state
    const onChange = e => {
      this.setState({
        value: e.target.value,
      })
    }
    const items = [
      {
        id: 1,
        name: '不限',
        label: 'no-limit',
        desc: '随机在用户公共节点下进行后续的容器应用部署',
      },
      {
        id: 2,
        name: '优先自有',
        label: 'res-prompt',
        desc: '优先选择用户组织下的节点进行容器应用部署',
      },
      {
        id: 3,
        name: '仅自有',
        label: 'res-limit',
        desc: '仅在用户归属组织的节点下进行容器应用部署',
      },
    ]
    return (
      <div>
        <Radio.Group onChange={onChange} value={value}>
          {items.map(item => (
            <Radio value={item.id} key={item.id}>
              {item.name}
            </Radio>
          ))}
        </Radio.Group>
        <div className={styles.desc}>说明：{items[value - 1].desc}</div>
      </div>
    )
  }

  renderFooter() {
    const { okBtnText } = this.props
    const { isSubmitting, formData, reason, value } = this.state
    const onClick = async () => {
      // console.log(111)
      const { status, data } = await applyRes({
        ...formData,
        uid: 1,
        reason,
        type: value,
      })
      // console.log(
      //   '🚀 ~ file: index.jsx ~ line 172 ~ ApplyDefault ~ onClick ~ res',
      //   data,
      //   Status
      // )
      if (status === 200 && data.code) {
        Notify.success({ content: `申请成功` })
        this.setState({
          value: 1,
          formData: {
            cpu: null,
            gpu: null,
            mem: null,
            disk: 40,
          },
          reason: '',
          key: [],
          defaultApp: '',
        })
      }
    }

    return (
      <div className={styles.footer}>
        <Button
          type="control"
          // onClick={this.handleCreate}
          loading={isSubmitting}
          // disabled={isSubmitting || !isEmpty(subRoute)}
          data-test="modal-create"
          onClick={onClick}
        >
          {okBtnText || '确认申请'}
        </Button>
      </div>
    )
  }

  renderRecommend() {
    const { key } = this.state
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(
        //   `selectedRowKeys: ${selectedRowKeys}`,
        //   'selectedRows: ',
        //   selectedRows
        // )
        const { formData } = this.state
        this.setState({
          key: selectedRowKeys,
          formData: {
            ...formData,
            ...selectedRows[0],
          },
        })
      },
    }

    const items = [
      {
        id: 1,
        name: 'tensorflow普通型',
        cpu: 8,
        mem: 48,
        gpu: 1,
        disk: 200,
      },
      {
        id: 2,
        name: 'tensorflow增强型',
        cpu: 16,
        mem: 64,
        gpu: 2,
        disk: 400,
      },
      {
        id: 3,
        name: 'tensorflow至强型',
        cpu: 32,
        mem: 128,
        gpu: 3,
        disk: 600,
      },
      {
        id: 4,
        name: 'torch普通型',
        cpu: 8,
        mem: 48,
        gpu: 1,
        disk: 100,
      },
      {
        id: 5,
        name: 'mysql普通型',
        cpu: 2,
        mem: 8,
        gpu: 0,
        disk: 100,
      },
      {
        id: 6,
        name: 'mysql增强型',
        cpu: 4,
        mem: 16,
        gpu: 0,
        disk: 200,
      },
      {
        id: 7,
        name: 'mysql高主频型',
        cpu: 8,
        mem: 32,
        gpu: 0,
        disk: 200,
      },
      {
        id: 8,
        name: 'tomcat普通型',
        cpu: 2,
        mem: 8,
        gpu: 0,
        disk: 100,
      },
      {
        id: 9,
        name: 'tomcat增强型',
        cpu: 4,
        mem: 16,
        gpu: 0,
        disk: 200,
      },
      {
        id: 10,
        name: 'tomcat高主频型',
        cpu: 8,
        mem: 32,
        gpu: 0,
        disk: 200,
      },
    ]
    const columns = [
      {
        title: '推荐配置',
        dataIndex: 'name',
      },
      {
        title: 'vCPU',
        dataIndex: 'cpu',
        render: item => `${item} vCPU`,
      },
      {
        title: '内存',
        dataIndex: 'mem',
        render: item => `${item} GiB`,
      },
      {
        title: 'vGPU',
        dataIndex: 'gpu',
        render: item => `${item} vGPU`,
      },
      {
        title: '磁盘',
        dataIndex: 'disk',
        render: item => `${item} GiB`,
      },
    ]
    return (
      <Table
        bordered={true}
        rowKey="id"
        rowSelection={{
          type: 'radio',
          ...rowSelection,
          selectedRowKeys: key,
        }}
        columns={columns}
        dataSource={items}
        pagination={{ position: ['none', 'none'] }}
        scroll={{ y: 320 }}
      />
    )
  }

  renderApply() {
    const { cpuOptions, memOptions, gpuOptions, formData } = this.state
    const handleChange = (e, type) => {
      this.setState({
        formData: {
          ...formData,
          [type]: e,
        },
      })
    }
    return (
      <Panel title="资源选择">
        <div className={styles.flex}>
          {/* panel */}
          <div className={styles.wrapper}>
            <div>
              <span>CPU：</span>
              <Select
                placeholder="选择 vCPU"
                style={{ width: 120 }}
                allowClear
                onChange={e => handleChange(e, 'cpu')}
                value={formData.cpu}
              >
                {cpuOptions.map(item => {
                  return (
                    <Option value={item} key={item}>
                      {item} vCPU
                    </Option>
                  )
                })}
              </Select>
            </div>
            <div>
              <span>内存：</span>
              <Select
                placeholder="选择内存"
                style={{ width: 120 }}
                allowClear
                onChange={e => handleChange(e, 'mem')}
                value={formData.mem}
              >
                {memOptions.map(item => {
                  return (
                    <Option value={item} key={item}>
                      {item} GiB
                    </Option>
                  )
                })}
              </Select>
            </div>
            <div>
              <span>GPU：</span>
              <Select
                placeholder="选择GPU"
                style={{ width: 120 }}
                allowClear
                onChange={e => handleChange(e, 'gpu')}
                value={formData.gpu}
              >
                {gpuOptions.map(item => {
                  return (
                    <Option key={item} value={item}>
                      {item > 0 ? `${item}vGPU` : '不需要'}
                    </Option>
                  )
                })}
              </Select>
            </div>
            <div>
              <span>磁盘：</span>
              <InputNumber
                min={1}
                max={100000}
                defaultValue={40}
                onChange={e => handleChange(e, 'disk')}
                value={formData.disk}
              />
              &nbsp;GiB
            </div>
          </div>
          {/* 推荐区域 */}
          <div className="recommend">{this.renderRecommend()}</div>
        </div>
      </Panel>
    )
  }

  renderReasonArea() {
    const { reason } = this.state
    const onChange = e => {
      this.setState({
        reason: e.target.value,
      })
    }

    return (
      <Panel title="申请说明">
        <TextArea
          rows={4}
          placeholder="请说明申请的资源的事项..."
          value={reason}
          onChange={onChange}
        ></TextArea>
      </Panel>
    )
  }

  render() {
    // const { match } = this.props
    const bannerProps = {
      className: 'margin-b12',
      title: '容器资源申请',
      description: '需要有足够的资源配额，才能使用容器平台创建应用。',
      module: 'review',
    }
    const onClickAppItem = app => {
      // eslint-disable-next-line no-console
      this.setState({
        defaultApp: app.app_id,
      })
    }

    const { defaultApp } = this.state

    return (
      <div>
        <Banner {...bannerProps} tips={this.tips} />
        {this.renderApply()}
        <Panel title="选择部署方式">{this.renderRadios()}</Panel>
        {/* 应用列表 */}
        <Panel title="选择应用模板">
          <Apps
            {...this.props}
            onClickAppItem={onClickAppItem}
            defaultApp={defaultApp}
          />
        </Panel>
        {/* 申请原因 */}
        {this.renderReasonArea()}
        {/* 底部操作按钮 */}
        {this.renderFooter()}
      </div>
    )
  }
}
