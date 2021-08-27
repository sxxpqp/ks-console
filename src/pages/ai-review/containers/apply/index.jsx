import React from 'react'
import { inject, observer } from 'mobx-react'
import Steps from 'apps/containers/AppDeploy/Steps'
import Banner from 'components/Cards/Banner'
// import { isEmpty } from 'lodash'
import { Button } from '@kube-design/components'
import ResourceLimit from 'ai-review/components/ResourceLimit'
import ClusterNodes from 'ai-review/components/ClusterNodes'
import Apps from 'ai-review/components/Apps'
import { Panel } from 'components/Base'
// import { Radio, Space } from 'antd'

import classnames from 'classnames'
import styles from './index.scss'

@inject('rootStore')
@observer
export default class ApplyDefault extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentStep: 0,
      formData: {},
      value: 1,
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

  get steps() {
    return [
      {
        title: '资源选择',
        // component: BasicInfo,
        required: true,
        isForm: true,
      },
      {
        title: '应用选择',
        // component: AppConfig,
        required: true,
      },
      {
        title: '完成',
        // component: AppConfig,
        required: true,
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

  handleRadioChange = e => {
    // console.log('🚀 ~ file: index.jsx ~ line 108 ~ ApplyDefault ~ e', e)
    const { value } = this.state
    let result = ''
    if (value !== e.id) {
      result = e.id
    }
    this.setState({
      value: result,
    })
  }

  renderSteps() {
    return (
      <div className={styles.steps}>
        <Steps steps={this.steps} current={this.state.currentStep} />
      </div>
    )
  }

  renderRadios() {
    const { value } = this.state
    const items = [
      {
        id: 1,
        name: 'tensorflow',
        res: {
          cpu: 32,
          gpu: 2,
          mem: 64 * 1024,
          disk: 400,
        },
      },
      {
        id: 2,
        name: 'torch',
        res: {
          cpu: 16,
          gpu: 1,
          mem: 32 * 1024,
          disk: 100,
        },
      },
      {
        id: 3,
        name: 'mysql',
        res: {
          cpu: 2,
          gpu: 0,
          mem: 4 * 1024,
          disk: 10,
        },
      },
      {
        id: 4,
        name: 'tomcat',
        res: {
          cpu: 4,
          gpu: 0,
          mem: 8 * 1024,
          disk: 40,
        },
      },
    ]
    return (
      <ul>
        {items.map(item => (
          <li
            className={classnames(styles.itemWrapper, {
              [styles.active]: value === item.id,
            })}
            key={item.id}
            onClick={() => this.handleRadioChange(item)}
          >
            <div className={styles.name}>{item.name}</div>
            <div className={styles.resource}>
              <span>CPU: {item.res.cpu} core</span>
              <span>内存: {(item.res.mem / 1024).toFixed(2)} G</span>
              <span>GPU: {item.res.gpu} core</span>
              <span>磁盘: {item.res.disk} G</span>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderHome() {
    return (
      <div className={styles.wrapper}>
        {/* 资源面板 */}
        <div className={styles.left}>
          <ResourceLimit
          // defaultValue={this.resourceLimit}
          // onChange={this.handleChange}
          // onError={this.handleError}
          />
        </div>
        <div className={styles.right}>
          <ClusterNodes />
          <Panel title="选择应用模板">{this.renderRadios()}</Panel>
        </div>
      </div>
    )
  }

  renderFooter() {
    const { currentStep } = this.state
    const { okBtnText, isSubmitting } = this.props
    const showCreate = this.steps.every((step, index) =>
      step.required ? currentStep >= index : true
    )

    const showNext = currentStep < this.steps.length - 1

    return (
      <div className={styles.footer}>
        {currentStep ? (
          <Button
            type="default"
            onClick={this.handlePrev}
            data-test="modal-previous"
          >
            {t('Previous')}
          </Button>
        ) : null}
        {showNext && (
          <Button
            type="control"
            onClick={this.handleNext}
            // disabled={!isEmpty(subRoute)}
            data-test="modal-next"
          >
            {t('Next')}
          </Button>
        )}
        {showCreate && (
          <Button
            type="control"
            // onClick={this.handleCreate}
            loading={isSubmitting}
            // disabled={isSubmitting || !isEmpty(subRoute)}
            data-test="modal-create"
          >
            {okBtnText || '确认申请'}
          </Button>
        )}
      </div>
    )
  }

  // 应用列表
  renderApps() {
    return (
      <div>
        <Apps {...this.props} />
      </div>
    )
  }

  renderApply() {
    return <div>apply</div>
  }

  renderSwitch() {
    const { currentStep } = this.state
    let result
    switch (currentStep) {
      case 0:
        result = this.renderHome()
        break
      case 1:
        result = this.renderApps()
        break
      case 2:
        result = this.renderApply()
        break
      default:
        result = this.renderHome()
        break
    }
    return result
  }

  render() {
    // const { match } = this.props
    const bannerProps = {
      className: 'margin-b12',
      title: '容器资源申请',
      description: '需要有足够的资源配额，才能使用容器平台创建应用。',
      module: 'review',
    }
    return (
      <div>
        <Banner {...bannerProps} tips={this.tips} />
        {/* 进度条 */}
        {this.renderSteps()}
        {this.renderSwitch()}
        {/* 底部操作按钮 */}
        {this.renderFooter()}
      </div>
    )
  }
}
