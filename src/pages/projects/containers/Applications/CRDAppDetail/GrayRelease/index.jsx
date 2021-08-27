import { isEmpty } from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Columns, Column } from '@kube-design/components'
import { toJS, when } from 'mobx'
import { observer, inject } from 'mobx-react'

import { joinSelector } from 'utils'
import EmptyList from 'components/Cards/EmptyList'
import { Component as Base } from 'projects/containers/GrayRelease/Jobs'

import styles from './index.scss'

@inject('detailStore')
@observer
class GrayRelease extends Base {
  constructor(props) {
    super(props)

    this.detailStore = props.detailStore
    this.module = props.module
  }

  componentDidMount() {
    this.disposer = when(
      () => !isEmpty(this.detailStore.detail),
      () => this.getData()
    )
  }

  componentWillUnmount() {
    if (this.disposer) {
      this.disposer()
    }
  }

  get canCreate() {
    const { cluster, workspace, namespace: project } = this.props.match.params
    return globals.app.hasPermission({
      cluster,
      workspace,
      project,
      module: 'grayscale-release',
      action: 'create',
    })
  }

  getData() {
    const { selector } = toJS(this.detailStore.detail)
    const params = {
      namespace: this.namespace,
      cluster: this.cluster,
      labelSelector: joinSelector(selector),
    }
    this.store.fetchList(params).then()
  }

  renderEmpty() {
    return (
      <EmptyList
        icon="istio"
        title={t('NO_GRAY_RELEASE_JOBS_TIP')}
        desc={t('NO_GRAY_RELEASE_JOBS_TIP_2')}
      />
    )
  }

  renderHeader() {
    const { cluster, workspace, namespace } = this.props.match.params

    return (
      <div className={styles.header}>
        <Columns>
          <Column>
            <p className={styles.headerTip}>{t('GRAY_RELEASE_DESC')}</p>
          </Column>
          <Column className="is-narrow">
            <Link
              to={`/${workspace}/clusters/${cluster}/projects/${namespace}/grayrelease/cates`}
            >
              {this.canCreate && (
                <Button type="control">
                  {t('Create Grayscale Release Job')}
                </Button>
              )}
            </Link>
          </Column>
        </Columns>
      </div>
    )
  }
}

export default GrayRelease
