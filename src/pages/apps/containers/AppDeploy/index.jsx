import React from 'react'
import { get } from 'lodash'
import { inject, observer } from 'mobx-react'
import { Button, Columns, Column, Loading } from '@kube-design/components'

import VersionStore from 'stores/openpitrix/version'
import AppStore from 'stores/openpitrix/app'
import AppFileStore from 'stores/openpitrix/file'

import BasicInfo from 'components/Forms/AppDeploy/BasicInfo'
import AppConfig from 'components/Forms/AppDeploy/AppConfig'
import Banner from 'apps/components/Banner'
import { generateId } from 'utils'
import { parse } from 'qs'

import Steps from './Steps'

import styles from './index.scss'

@inject('rootStore')
@observer
export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.appId = this.props.match.params.appId
    this.appStore = new AppStore()
    this.versionStore = new VersionStore()
    this.fileStore = new AppFileStore()

    const { workspace, cluster, namespace } =
      parse(location.search.slice(1)) || {}

    this.state = {
      currentStep: 0,
      formData: {
        app_id: this.appId,
        workspace,
        cluster,
        namespace,
      },
    }

    // console.log(this.props.rootStore.myCluster)

    this.formRef = React.createRef()
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get steps() {
    return [
      {
        title: 'Basic Info',
        component: BasicInfo,
        required: true,
        isForm: true,
      },
      {
        title: 'App Config',
        component: AppConfig,
        required: true,
      },
    ]
  }

  componentDidMount() {
    this.fixBodyColor()
    this.getData()
  }

  componentWillUnmount() {
    // restore bg color
    document.querySelector('html').style.backgroundColor = this.htmlOrigBgColor
  }

  fixBodyColor() {
    const htmlElem = document.querySelector('html')
    this.htmlOrigBgColor = window.getComputedStyle(htmlElem).backgroundColor
    htmlElem.style.backgroundColor = 'white'
  }

  async getData() {
    await Promise.all([
      this.appStore.fetchDetail({ app_id: this.appId }),
      this.versionStore.fetchList({ app_id: this.appId, status: 'active' }),
    ])

    const selectAppVersion = get(
      this.versionStore,
      'list.data[0].version_id',
      ''
    )
    const { name } = this.appStore.detail
    this.setState({
      formData: {
        ...this.state.formData,
        name: `${name
          .slice(0, 7)
          .toLowerCase()
          .replaceAll(' ', '-')}-${generateId()}`,
        version_id: selectAppVersion,
      },
    })

    this.fileStore.fetch({ version_id: selectAppVersion })
  }

  handleOk = () => {
    const form = this.formRef.current
    form &&
      form.validate(() => {
        const {
          cluster,
          workspace,
          namespace,
        } = this.props.rootStore.myClusters
        const { ...rest } = this.state.formData
        this.appStore
          .deploy(rest, { cluster, namespace, workspace })
          .then(() => {
            this.routing.push(
              `/${workspace}/clusters/${cluster}/projects/${namespace}/applications/template`
            )
          })
      })
  }

  handlePrev = () => {
    if (this.state.currentStep <= 0) {
      // this.routing.push(`/apps/${this.appId}`)
      this.routing.goBack()
    } else {
      this.setState(({ currentStep }) => ({
        currentStep: Math.max(0, currentStep - 1),
      }))
    }
  }

  handleNext = () => {
    const form = this.formRef.current
    form &&
      form.validate(() => {
        this.setState(({ currentStep }) => ({
          currentStep: Math.min(this.steps.length - 1, currentStep + 1),
        }))
      })
  }

  renderForm() {
    const { isLoading } = this.appStore
    const { formData, currentStep } = this.state

    if (isLoading) {
      return <Loading className={styles.loading} />
    }

    const step = this.steps[currentStep]
    const Component = step.component

    const props = {
      formData,
      fromStore: true,
      versionStore: this.versionStore,
      fileStore: this.fileStore,
      appId: this.appId,
    }

    if (step.isForm) {
      props.formRef = this.formRef
    } else {
      props.ref = this.formRef
    }

    return (
      <div className={styles.form}>
        <Component {...props} />
      </div>
    )
  }

  renderControl() {
    // const { currentStep } = this.state

    // const total = this.steps.length - 1
    return (
      <div className={styles.control}>
        <div>
          <Button type="default" onClick={this.handleNext}>
            {'配置详情'}
          </Button>
        </div>
        <div>
          <Button
            type="control"
            onClick={this.handleOk}
            loading={this.appStore.isSubmitting}
          >
            部署
          </Button>
        </div>
        {/* {currentStep < total ? (
          <Button type="control" onClick={this.handleNext}>
            {'t('Next')'}
          </Button>
        ) : (
          <Button
            type="control"
            onClick={this.handleOk}
            loading={this.appStore.isSubmitting}
          >
            {t('Deploy')}
          </Button>
        )} */}
      </div>
    )
  }

  renderSteps() {
    return (
      <div className={styles.steps}>
        <div className={styles.stepsWrapper}>
          <Steps steps={this.steps} current={this.state.currentStep} />
          <div>{this.renderControl()}</div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.main}>
        <Banner
          className={styles.banner}
          detail={this.appStore.detail}
          onBack={this.handlePrev}
        />
        <div className={styles.content}>
          {this.renderSteps()}
          <Columns className={styles.formWrapper}>
            <Column>{this.renderForm()}</Column>
            {/* <Column className="is-narrow"></Column> */}
          </Columns>
        </div>
      </div>
    )
  }
}
