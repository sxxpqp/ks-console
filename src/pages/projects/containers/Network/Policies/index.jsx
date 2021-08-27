import React from 'react'
import { inject, observer } from 'mobx-react'
import { get, set } from 'lodash'
import { Button } from '@kube-design/components'
import { Panel } from 'components/Base'
import Banner from 'components/Cards/Banner'
import EmptyList from 'components/Cards/EmptyList'
import { ICON_TYPES } from 'utils/constants'
import RuleInfo from './RuleInfo'
import IsolateInfo from './IsolateInfo'
import styles from './index.scss'

@inject('projectStore')
@observer
export default class Policies extends React.Component {
  name = 'Network Isolation'

  module = 'namespacenetworkpolicies'

  tips = [
    {
      title: t('NETWORK_ISOLATION_Q'),
      description: t('NETWORK_POLICY_A'),
    },
    {
      title: t('NETWORK_ISOLATION_Q1'),
      description: t.html('NETWORK_POLICY_A1'),
    },
  ]

  constructor(props) {
    super(props)
    this.projectStore = this.props.projectStore
  }

  get params() {
    return get(this.props.match, 'params', {})
  }

  get namespace() {
    return get(this.params, 'namespace')
  }

  get cluster() {
    return get(this.params, 'cluster')
  }

  get workspace() {
    return get(this.projectStore, 'detail.workspace', '')
  }

  get enabledActions() {
    return globals.app.getActions({
      module: 'project-settings',
      ...this.params,
      project: this.params.namespace,
    })
  }

  toggleNetworkIsolate = (flag = true) => {
    const data = {}
    set(
      data,
      'metadata.annotations["kubesphere.io/network-isolate"]',
      flag ? 'enabled' : ''
    )
    this.projectStore
      .patch({ name: this.namespace, cluster: this.cluster }, data)
      .then(() => {
        this.projectStore.fetchDetail(this.params)
      })
  }

  handleEditNetworkIsolate = flag => {
    this.toggleNetworkIsolate(flag)
  }

  render() {
    const { module, name, tips, namespace, cluster, workspace } = this
    const { isSubmitting } = this.projectStore
    const networkIsolate =
      get(
        this.projectStore,
        'detail.annotations["kubesphere.io/network-isolate"]'
      ) === 'enabled'

    const canEdit = this.enabledActions.includes('edit')

    return (
      <div>
        <Banner
          module={module}
          className="margin-b12"
          title={t(name)}
          tips={tips}
          description={t(`${name.replace(/\s+/g, '_').toUpperCase()}_DESC`)}
        />
        <div className={styles.subtitle}>{t(name)}</div>
        {!networkIsolate ? (
          <EmptyList
            icon={ICON_TYPES[module]}
            title={t('NETWORK_POLICY_EMP_TITLE')}
            desc={t('NETWORK_POLICY_EMP_DESC')}
            className={styles.eplist}
            actions={
              canEdit && (
                <Button
                  type="control"
                  loading={isSubmitting}
                  onClick={this.toggleNetworkIsolate}
                >
                  {t('On')}
                </Button>
              )
            }
          />
        ) : (
          <Panel className={styles.wrapper}>
            <IsolateInfo
              module={module}
              networkIsolate={networkIsolate}
              onEdit={this.handleEditNetworkIsolate}
              canEdit={canEdit}
            />
            <RuleInfo
              module={module}
              namespace={namespace}
              cluster={cluster}
              workspace={workspace}
              canEdit={canEdit}
            />
          </Panel>
        )}
      </div>
    )
  }
}
