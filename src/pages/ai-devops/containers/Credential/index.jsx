import React from 'react'
import { observer, inject } from 'mobx-react'

import { toJS } from 'mobx'
import { parse } from 'qs'
import { omit } from 'lodash'

import CredentialStore from 'stores/devops/credential'
import { trigger } from 'utils/action'
import { getLocalTime } from 'utils'

import { Avatar } from 'components/Base'
import Banner from 'ai-devops/components/Banner'
// import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/Base'

import styles from './index.scss'

@inject('rootStore', 'devopsStore')
@observer
@trigger
class Credential extends React.Component {
  type = 'credentials'

  constructor(props) {
    super(props)

    this.store = new CredentialStore()
    // console.log(
    //   '🚀 ~ file: index.jsx ~ line 47 ~ Credential ~ constructor ~ this.store',
    //   this.store
    // )
    this.formTemplate = {}
  }

  get devops() {
    return globals.user.ai.devops
    // return this.props.match.params.devops
  }

  componentDidMount() {
    this.unsubscribe = this.routing.history.subscribe(location => {
      const params = parse(location.search.slice(1))
      const { cluster } = this.props.match.params

      this.store.fetchList({
        devops: this.devops,
        cluster,
        ...params,
      })
    })
  }

  // componentDidUpdate() {
  //   const tmp = {
  //     ...omit(this.props.match.params, 'namespace'),
  //     devops: 'ks-consolekkwfw',
  //   }
  //   this.props.rootStore.getRules(tmp)
  // }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  get enabledActions() {
    return globals.app.getActions({
      module: 'credentials',
      cluster: this.cluster,
      devops: this.devops,
    })
  }

  // get devops() {
  //   return this.props.match.params.devops
  // }

  get cluster() {
    return this.props.match.params.cluster
  }

  get workspace() {
    return this.props.match.params.workspace
  }

  getData() {
    const { cluster } = this.props.match.params
    const query = parse(location.search.slice(1))

    this.store.fetchList({
      devops: this.devops,
      cluster,
      ...query,
    })
  }

  handleFetch = (params, refresh) => {
    this.routing.query(params, refresh)
  }

  get prefix() {
    if (this.props.match.url.endsWith('/')) {
      return this.props.match.url.slice(0, -1)
    }
    return this.props.match.url
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get module() {
    return 'cridentials'
  }

  get name() {
    return 'Credentials'
  }

  handleCreate = () => {
    const { cluster } = this.props.match.params
    this.trigger('devops.credential.create', {
      devops: this.devops,
      cluster,
      success: () => {
        this.getData()
      },
    })
  }

  getColumns = () => [
    {
      title: '凭证ID',
      // title: t('Name'),
      dataIndex: 'name',
      width: '35%',
      render: id => {
        const url = `/${this.workspace}/clusters/${this.cluster}/devops/${
          this.devops
        }/credentials/${encodeURIComponent(id)}`
        // const url = `${this.prefix}/${encodeURIComponent(id)}`
        return <Avatar to={this.isRuning ? null : url} title={id} />
      },
    },
    {
      title: t('Type'),
      dataIndex: 'type',
      width: '25%',
      render: type => t(type),
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      render: description => description,
      width: '25%',
    },
    {
      title: t('Created Time'),
      dataIndex: 'createTime',
      width: '20%',
      render: createTime =>
        getLocalTime(createTime).format(`YYYY-MM-DD HH:mm:ss`),
    },
  ]

  renderContent() {
    const { data, filters, isLoading, total, page, limit } = toJS(
      this.store.list
    )
    const showCreate = this.enabledActions.includes('create')
      ? this.handleCreate
      : null

    const omitFilters = omit(filters, ['page', 'limit', 'sortBy'])
    const pagination = { total, page, limit }

    return (
      <Table
        data={data}
        columns={this.getColumns()}
        filters={omitFilters}
        pagination={pagination}
        rowKey="uid"
        isLoading={isLoading}
        onFetch={this.handleFetch}
        onCreate={showCreate}
        searchType="name"
        module={this.module}
        name={this.name}
      />
    )
  }

  render() {
    const { match } = this.props
    return (
      <div className={styles.wrapper}>
        {/* <Banner
          title={t('DevOps Credentials')}
          icon="key"
          description={t('DEVOPS_PROJECT_CREDENTIALS_DESC')}
          module={this.module}
        /> */}
        <Banner title={t('DevOps Projects')} match={match} type={this.type} />
        {this.renderContent()}
      </div>
    )
  }
}

export default Credential
