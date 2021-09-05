import React from 'react'
import { observer, inject } from 'mobx-react'
import qs from 'qs'

import {
  Level,
  LevelLeft,
  LevelRight,
  InputSearch,
} from '@kube-design/components'

import { getScrollTop } from 'utils/dom'
import PublishedAppStore from 'stores/openpitrix/store'
import CategoryStore from 'stores/openpitrix/category'
import { STORE_APP_LIMIT } from 'configs/openpitrix/app'

import AppList from './components/AppList'

import styles from './index.scss'

const noCategories = ['new', 'all']
const scrollThreshold = 200

@inject('rootStore')
@observer
export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.appStore = new PublishedAppStore()
    this.categoryStore = new CategoryStore()

    this.cateRef = React.createRef()
    this.appRef = React.createRef()
  }

  get queryParams() {
    return qs.parse(location.search.slice(1))
  }

  async componentDidMount() {
    const { fetchList, list } = this.categoryStore

    await fetchList({ noLimit: true })
    list.data.unshift({
      category_id: 'all',
      name: t('All'),
      description: 'templet',
    })
    await this.fetchApps()

    window.addEventListener('scroll', this.handleScroll)
  }

  async componentDidUpdate(prevProps) {
    const { location } = this.props
    if (prevProps.location.search !== location.search) {
      await this.fetchApps()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  fetchApps = async (filters = {}, replaceAll = true) => {
    const { category, keyword } = this.queryParams
    const params = {}
    if (keyword) {
      params.keyword = keyword
    }
    if (category && !noCategories.includes(category)) {
      params.category_id = category
    }

    await this.appStore.fetchList({
      limit: STORE_APP_LIMIT,
      status: 'active',
      ...params,
      ...filters,
    })

    const { allApps, list } = this.appStore

    if (replaceAll) {
      allApps.clear()
      allApps.replace(list.data)
    } else {
      allApps.push(...list.data)
    }
  }

  fetchMoreApps = async () => {
    const { page } = this.appStore.list
    await this.fetchApps({ page: page + 1 }, false)
  }

  handleScroll = () => {
    if (
      !this.cateRef ||
      !this.cateRef.current ||
      !this.appRef ||
      !this.appRef.current
    ) {
      return
    }

    const scrollTop = getScrollTop()
    const classes = this.cateRef.current.classList
    const isFixed = classes.contains('fixed-cates')
    const isValidate =
      this.cateRef.current.clientHeight < this.appRef.current.clientHeight ||
      this.cateRef.current.clientHeight < document.documentElement.clientHeight

    if (scrollTop >= scrollThreshold && !isFixed && isValidate) {
      classes.add('fixed-cates')
    } else if (scrollTop < scrollThreshold && isFixed) {
      classes.remove('fixed-cates')
    }
  }

  handleSearch = keyword => {
    this.props.rootStore.query({ keyword })
  }

  renderToolbar() {
    const { total } = this.appStore.list
    const { keyword } = this.queryParams

    return (
      <div className={styles.toolbar}>
        <Level className={styles.level}>
          <LevelLeft className={styles.countDesc}>
            {t(`TOTAL_CATE_COUNT`, { total })}
          </LevelLeft>
          <LevelRight>
            <InputSearch
              onSearch={this.handleSearch}
              value={keyword}
              className={styles.search}
              placeholder={t('Find an app')}
            />
          </LevelRight>
        </Level>
      </div>
    )
  }

  render() {
    const { list, allApps } = this.appStore
    const { isLoading, total } = list
    const { workspace, namespace, cluster } = this.queryParams
    const { onClickAppItem, defaultApp } = this.props

    return (
      <div className={styles.wrapper}>
        {this.renderToolbar()}
        <div className={styles.body}>
          {/* {this.renderCategories()} */}
          <AppList
            className={styles.apps}
            appRef={this.appRef}
            title=""
            apps={allApps.slice()}
            isLoading={isLoading}
            total={total}
            onFetchMore={this.fetchMoreApps}
            workspace={workspace}
            namespace={namespace}
            cluster={cluster}
            onClickAppItem={onClickAppItem}
            defaultApp={defaultApp}
            disableLink
          />
        </div>
      </div>
    )
  }
}
