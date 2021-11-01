import React from 'react'
import { inject, observer } from 'mobx-react'
import Banner from 'components/Cards/Banner'
import { Button, Notify } from '@kube-design/components'
import Apps from 'ai-review/components/Apps'
import { Panel } from 'components/Base'
import {
  Select,
  InputNumber,
  Radio,
  Input,
  Table,
  Row,
  Col,
  Statistic,
} from 'antd'
// import { Radio, Space } from 'antd'

import { applyRes } from 'api/apply'
// import { Link } from 'react-router-dom'
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

  get routing() {
    return this.props.rootStore.routing
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
        name: '仅申请资源',
        label: 'only-res',
        desc: '只申请硬件资源，不配置默认容器应用',
      },
      {
        id: 2,
        name: '应用模板',
        label: 'app-template',
        desc: '选择平台的应用模板，并在申请通过后，可以一键部署',
      },
      // {
      //   id: 3,
      //   name: '自定义',
      //   label: 'custom',
      //   desc: '创建包含工作负载、服务的自定义应用，可以高度自定义（YAML）配置',
      // },
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

  gotoHis() {
    const { workspace, namespace, cluster } = this.props.match.params
    this.routing.push(
      `/${workspace}/clusters/${cluster}/projects/${namespace}/applyhis`
    )
  }

  renderFooter() {
    const { okBtnText } = this.props
    const { isSubmitting, formData, reason, value, defaultApp } = this.state

    // 确定申请回调
    const onClick = async () => {
      // console.log(111)
      const { status, data } = await applyRes({
        ...formData,
        uid: 1,
        reason,
        type: value,
        app: defaultApp,
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
        this.gotoHis()
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
        key: [], // 清空推荐选项
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

  renderHisResource() {
    // 查看历史
    const showApplyHis = () => {
      const { history } = this.props
      const { cluster, workspace, namespace } = this.props.match.params

      const PATH = `/${workspace}/clusters/${cluster}/projects/${namespace}/applyhis`
      history.push({ pathname: PATH, state: { name: 'applyhis' } })
    }

    return (
      <Panel title="资源情况统计">
        <Row>
          <Col span={6}>
            <Statistic
              title="CPU"
              value={'12 vCore'}
              valueStyle={{ color: '#333' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="内存"
              value={'128 GiB'}
              valueStyle={{ color: '#333' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="磁盘"
              value={'48 GiB'}
              valueStyle={{ color: '#333' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="GPU"
              value={'4 vCore'}
              valueStyle={{ color: '#333' }}
            />
          </Col>
        </Row>
        <Row justify="end">
          <Button
            type="default"
            data-test="modal-create"
            onClick={showApplyHis}
          >
            查看历史
          </Button>
        </Row>
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
      this.setState({
        defaultApp: app.app_id,
      })
    }

    const { defaultApp, value } = this.state

    return (
      <div>
        <Banner {...bannerProps} />
        {this.renderHisResource()}
        {/* <Banner {...bannerProps} tips={this.tips} /> */}
        {this.renderApply()}
        <Panel title="选择部署方式">{this.renderRadios()}</Panel>
        {/* 应用列表 */}
        {value === 2 ? (
          <Panel title="选择应用模板">
            <Apps
              {...this.props}
              onClickAppItem={onClickAppItem}
              defaultApp={defaultApp}
            />
          </Panel>
        ) : (
          <></>
        )}
        {/* 申请原因 */}
        {this.renderReasonArea()}
        {/* 底部操作按钮 */}
        {this.renderFooter()}
      </div>
    )
  }
}
