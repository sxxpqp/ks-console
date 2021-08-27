import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import moment from 'moment-mini'

import { Button, RadioGroup, Columns, Column } from '@kube-design/components'

import { TypeSelect } from 'components/Base'
import AppPreview from 'apps/components/AppPreview'
import AppBase from 'apps/components/AppBase'

import AppStore from 'stores/openpitrix/app'
import VersionStore from 'stores/openpitrix/version'

import Banner from './Banner'

import styles from './index.scss'

@observer
class AppDetail extends Component {
  static propTypes = {
    app: PropTypes.object,
    setType: PropTypes.func,
    workspace: PropTypes.string,
  }

  static defaultProps = {
    app: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      tab: 'versionInfo',
      selectAppVersion: '',
      showDeploy: false,
    }

    this.appStore = new AppStore()
    this.versionStore = new VersionStore()
  }

  get appId() {
    return this.props.app.app_id
  }

  async componentDidMount() {
    await this.fetchVersions()
    const selectAppVersion = get(
      this.versionStore,
      'list.data[0].version_id',
      ''
    )
    this.setState(() => ({ selectAppVersion }))

    this.appStore.fetchDetail({ app_id: [this.appId] })
  }

  componentWillUnmount() {
    this.props.setType()
  }

  get tabs() {
    return [
      {
        label: t('App Info'),
        value: 'versionInfo',
      },
      {
        label: t('Chart Files'),
        value: 'chartFiles',
      },
    ]
  }

  get versionOptions() {
    const versions = this.versionStore.list.data
    return versions.map(({ version_id, name, create_time }) => ({
      label: name,
      description: moment(create_time).format(t('YYYY-MM-DD')),
      value: version_id,
    }))
  }

  fetchVersions = async (params = {}) => {
    await this.versionStore.fetchList({
      ...params,
      app_id: this.appId,
      noLimit: true,
    })
  }

  handleTabChange = tab => {
    this.setState({ tab })
  }

  handleClickBack = () => {
    const { app } = this.props
    this.props.setType('appList', app.repo_id)
  }

  showDeploy = () => {
    this.props.onDeploy({
      app: this.appStore.detail,
      store: this.appStore,
    })
  }

  handleChangeAppVersion = version => {
    this.setState({ selectAppVersion: version })
  }

  renderVersionList() {
    return (
      <div className="margin-b12">
        <div className="h6 margin-b12">{t('Versions')}</div>
        <TypeSelect
          value={this.state.selectAppVersion}
          options={this.versionOptions}
          onChange={this.handleChangeAppVersion}
        />
      </div>
    )
  }

  render() {
    const { app } = this.props
    const { selectAppVersion, tab } = this.state
    const { detail } = this.appStore

    return (
      <>
        <Banner
          onClickBack={this.handleClickBack}
          title={app.name}
          desc={app.description}
          icon={app.icon}
        />
        <div className={styles.bar}>
          <RadioGroup
            mode="button"
            value={tab}
            options={this.tabs}
            onChange={this.handleTabChange}
          />
          <Button type="control" onClick={this.showDeploy}>
            {t('Deploy')}
          </Button>
        </div>
        <div className={styles.content}>
          <Columns>
            <Column>
              <AppPreview
                appId={this.appId}
                versionId={selectAppVersion}
                currentTab={tab}
              />
            </Column>
            <Column className="is-narrow">
              {this.renderVersionList()}
              <AppBase app={detail} />
            </Column>
          </Columns>
        </div>
      </>
    )
  }
}

export default AppDetail
