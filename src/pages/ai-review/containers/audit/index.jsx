import React from 'react'
// import { inject, observer } from 'mobx-react'
import Banner from 'components/Cards/Banner'
import { withDevOpsList, ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import { toJS } from 'mobx'
// import { cloneDeep, get, isEmpty, omit } from 'lodash'
import { omit, isEmpty } from 'lodash'
import PipelineStore from 'stores/devops/pipelines'

// @inject('rootStore')
// @observer
@withDevOpsList({
  store: new PipelineStore(),
  module: 'pipelines',
  name: 'DevOps Projects',
  rowKey: 'name',
})
export default class ApplyDefault extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentStep: 0,
      formData: {},
    }

    this.formRef = React.createRef()
  }

  // get tips() {
  //   return [
  //     {
  //       title: '资源选择',
  //       description: t('SERVICE_TYPES_A'),
  //     },
  //     {
  //       title: '应用选择',
  //       description: t('SCENARIOS_FOR_SERVICES_A'),
  //     },
  //   ]
  // }

  get itemActions() {
    const { trigger, name } = this.props

    return [
      {
        key: 'run',
        icon: 'triangle-right',
        text: t('Run'),
        action: 'edit',
        onClick: record => {
          this.handleRun(record)
        },
      },
      {
        key: 'activity',
        icon: 'calendar',
        text: t('Activity'),
        action: 'view',
        onClick: record => {
          this.props.rootStore.routing.push(
            `${this.prefix}/${encodeURIComponent(record.name)}/activity`
          )
        },
      },
      {
        key: 'edit',
        icon: 'pen',
        text: t('Edit'),
        action: 'edit',
        onClick: record => {
          this.handleAdvanceEdit(record.name)
        },
      },
      {
        key: 'copy',
        icon: 'copy',
        text: t('Copy Pipeline'),
        action: 'edit',
        onClick: record => {
          this.handleCopy(record.name)
        },
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('Delete'),
        action: 'delete',
        onClick: record => {
          trigger('resource.delete', {
            type: t(name),
            resource: record.name,
            detail: {
              name: record.name,
              devops: this.devops,
              cluster: this.cluster,
            },
            success: () => {
              this.handleFetch()
            },
          })
        },
      },
    ]
  }

  getColumns = () => [
    {
      title: '序号',
      dataIndex: 'name',
      width: '10%',
      render: (name, record) => {
        // const url = ''
        const url = `/${this.workspace}/clusters/${this.cluster}/devops/${
          this.devops
        }/pipelines/${encodeURIComponent(record.name)}${
          !isEmpty(record.scmSource) ? '/activity' : ''
        }`

        return <Avatar to={this.isRuning ? null : url} title={name} />
      },
    },

    {
      title: 'Cpu',
      dataIndex: 'cpu',
      width: '10%',
      isHideable: true,
      render: weatherScore => <Health score={weatherScore} />,
    },
    {
      title: '内存(Mi)',
      dataIndex: 'mem',
      width: '10%',
      isHideable: true,
      render: totalNumberOfBranches =>
        totalNumberOfBranches === undefined ? '-' : totalNumberOfBranches,
    },
    {
      title: '磁盘',
      dataIndex: 'disk',
      width: '10%',
      isHideable: true,
      render: totalNumberOfPullRequests =>
        totalNumberOfPullRequests === undefined
          ? '-'
          : totalNumberOfPullRequests,
    },
    {
      title: 'GPU',
      dataIndex: 'gpu',
      width: '10%',
      isHideable: true,
    },
    {
      title: '申请人',
      dataIndex: 'creator',
      width: '15%',
      isHideable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      width: '15%',
      isHideable: true,
    },
    {
      title: '详情',
      dataIndex: 'more',
      width: '20%',
      isHideable: true,
    },
  ]

  get enabledActions() {
    return globals.app.getActions({
      module: 'pipelines',
      cluster: this.props.match.params.cluster,
      devops: this.devops,
    })
  }

  renderContent() {
    const {
      data = [],
      filters,
      isLoading,
      total,
      page,
      limit,
      selectedRowKeys,
    } = toJS(this.props.store.list)

    const isEmptyList = isLoading === false && total === 0
    const omitFilters = omit(filters, ['limit', 'page'])

    const showCreate = this.enabledActions.includes('create')
      ? this.handleCreate
      : null

    if (isEmptyList && Object.keys(omitFilters).length <= 0) {
      return (
        <Empty
          name="Pipeline"
          action={
            showCreate ? (
              <Button onClick={showCreate} type="control">
                {t('Create')}
              </Button>
            ) : null
          }
        />
      )
    }

    const pagination = { total, page, limit }

    const defaultTableProps = {
      hideCustom: false,
      onSelectRowKeys: this.props.store.setSelectRowKeys,
      selectedRowKeys,
      selectActions: [
        {
          key: 'run',
          type: 'primary',
          text: t('Run'),
          action: 'delete',
          onClick: this.handleMultiBatchRun,
        },
        {
          key: 'delete',
          type: 'danger',
          text: t('Delete'),
          action: 'delete',
          onClick: () =>
            this.props.trigger('pipeline.batch.delete', {
              type: t('Pipeline'),
              rowKey: 'name',
              devops: this.devops,
              cluster: this.cluster,
              success: () => {
                setTimeout(() => {
                  this.handleFetch()
                }, 1000)
              },
            }),
        },
      ],
    }

    return (
      <Table
        rowKey="name"
        data={data}
        columns={this.getColumns()}
        // filters={omitFilters}
        pagination={pagination}
        isLoading={isLoading}
        // isLoading={isLoading}
        // onFetch={this.handleFetch}
        // onCreate={showCreate}
        searchType="name"
        tableActions={defaultTableProps}
        itemActions={this.itemActions}
        enabledActions={this.enabledActions}
      />
    )
  }

  render() {
    // const { match } = this.props
    const bannerProps = {
      className: 'margin-b12',
      title: '容器资源审批',
      description:
        '人工智能平台用户申请的资源清单，查看资源详情，对资源申请进行审批。',
      module: 'review',
    }
    return (
      <ListPage getData={this.getData} {...this.props}>
        <Banner {...bannerProps} />
        {this.renderContent()}
      </ListPage>
    )
  }
}
