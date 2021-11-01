import React from 'react'
import { capitalize } from 'lodash'

// import { Button } from '@kube-design/components'

import { Status } from 'components/Base'
import Avatar from 'apps/components/Avatar'
import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/List'
import withList, { ListPage } from 'components/HOCs/withList'
import { getLocalTime, getDisplayName } from 'utils'
import { transferAppStatus } from 'utils/app'

import AppStore from 'stores/openpitrix/app'
import CategoryStore from 'stores/openpitrix/category'

@withList({
  store: new AppStore(),
  module: 'apps',
  authKey: 'app-templates',
  name: 'App Template',
  rowKey: 'app_id',
})
export default class Apps extends React.Component {
  constructor(props) {
    super(props)
    this.categoryStore = new CategoryStore()
  }

  async componentDidMount() {
    const { fetchList } = this.categoryStore

    await fetchList({ noLimit: true })
    // await this.fetchApps()
  }
  // get tips() {
  //   const { enabledActions } = this.props
  //   return [
  //     {
  //       title: '创建容器应用模板',
  //       description:
  //         '您可以上传容器应用配置 Helm Chart 或者使用 KubeSphere 提供的资源编排工具进行应用模板的开发',
  //       operation: enabledActions.includes('create') ? (
  //         <Button type="flat" onClick={this.showUpload}>
  //           {t('Upload Template')}
  //         </Button>
  //       ) : null,
  //       closable: false,
  //     },
  //     {
  //       title: '发布容器应用模板至公共空间',
  //       description:
  //         '用户上传的模板默认只能自己使用，如果需要提供给他人使用，需要有管理权限的人进行审核才能进行公共使用',
  //     },
  //   ]
  // }

  get workspace() {
    return this.props.match.params.workspace
  }

  getData = params => {
    this.props.store.fetchList({
      workspace: this.workspace,
      statistics: true,
      ...params,
    })
  }

  get itemActions() {
    return []
  }

  get tableActions() {
    const { tableProps } = this.props
    return {
      ...tableProps.tableActions,
      onCreate: this.showCreate,
      selectActions: [],
    }
  }

  showCreate = () => {
    this.props.trigger('openpitrix.template.create', {
      success: this.showUpload,
    })
  }

  showUpload = () => {
    this.props.trigger('openpitrix.template.upload', {
      workspace: this.workspace,
      success: this.props.routing.query,
    })
  }

  getColumns = () => [
    {
      title: t('Name'),
      dataIndex: 'app_id',
      render: (app_id, app) => {
        const avatar = this.getAvatar(app.icon)
        return (
          <Avatar
            isApp
            to={`/workspaces/${this.workspace}/apps/${app_id}`}
            avatarType={'appIcon'}
            avatar={avatar}
            iconLetter={app.name}
            iconSize={40}
            title={getDisplayName(app)}
            desc={app.description}
          />
        )
      },
    },
    {
      title: t('分类'),
      dataIndex: 'category_set',
      isHideable: true,
      width: '20%',
      render: record => {
        // this.getCateName(record)
        // console.log(this.categoryStore.list.data)
        // console.log('🚀 ~ file: index.jsx ~ line 131 ~ Apps ~ record', record)
        return record.length
          ? record
              .map(item =>
                t(`APP_CATE_${item.name.toUpperCase()}`, {
                  defaultValue: item.name,
                })
              )
              .join(' ')
          : '未设置'
      },
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      isHideable: true,
      width: '20%',
      render: status => (
        <Status type={status} name={t(capitalize(transferAppStatus(status)))} />
      ),
    },
    {
      title: t('Latest Version'),
      dataIndex: 'latest_app_version.name',
      isHideable: true,
      width: '20%',
    },
    {
      title: t('Updated Time'),
      dataIndex: 'update_time',
      isHideable: true,
      width: '120',
      render: (time, item) => getLocalTime(time || item.status_time).fromNow(),
    },
  ]

  getAvatar = icon => {
    const baseUrl = this.props.store.baseUrl

    return String(icon).startsWith('att-')
      ? `/${baseUrl}/attachments/${icon}?filename=raw`
      : icon
  }

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props} getData={this.getData} noWatch>
        <Banner
          {...bannerProps}
          // tips={this.tips}
          title={'容器应用模板仓库'}
          description={
            '用户可以上传或者创建新的容器应用模板，并且快速部署它们，也可以使用已有的应用模板进行应用部署。'
          }
        />
        <Table
          {...tableProps}
          tableActions={this.tableActions}
          itemActions={this.itemActions}
          columns={this.getColumns()}
          searchType="keyword"
        />
      </ListPage>
    )
  }
}
