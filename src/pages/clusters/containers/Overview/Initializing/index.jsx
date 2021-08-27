import { get } from 'lodash'
import React, { Component } from 'react'
import { toJS, reaction } from 'mobx'
import { observer, inject } from 'mobx-react'
import {
  Button,
  Icon,
  Menu,
  Loading,
  Notify,
  Dropdown,
} from '@kube-design/components'
import { Panel, Text, CodeEditor } from 'components/Base'
import { copyToClipboard } from 'utils/dom'
import { trigger } from 'utils/action'
import KubeKeyClusterStore from 'stores/cluster/kubekey'

import KubeKeyCluster from './KubeKeyCluster'

import styles from './index.scss'

@inject('rootStore')
@observer
@trigger
export default class Initializing extends Component {
  kubekeyClusterStore = new KubeKeyClusterStore()

  websocket = this.props.rootStore.websocket

  get editOptions() {
    return {
      width: '100%',
      height: '100%',
      readOnly: true,
    }
  }

  componentDidMount() {
    const { name, conditions } = this.props.store.detail
    if (get(conditions, 'Initialized.status') === 'True') {
      this.props.store.fetchAgent({ cluster: name })
    }

    this.initWebsocket()
  }

  componentWillUnmount() {
    this.websocket.close()
    this.disposer && this.disposer()
  }

  initWebsocket = () => {
    const { store, match } = this.props
    const url = store.getWatchUrl({ name: match.params.cluster })
    if (url) {
      this.websocket.watch(url)

      this.disposer = reaction(
        () => this.websocket.message,
        message => {
          if (message.type === 'MODIFIED') {
            store.fetchDetail(store.detail)
          }
        }
      )
    }
  }

  handleCopy = () => {
    copyToClipboard(toJS(this.props.store.agent))
    Notify.success({ content: t('Copy successful') })
  }

  showEditYAML = () => {
    const store = this.kubekeyClusterStore
    this.trigger('resource.yaml.edit', {
      store,
      detail: toJS(store.detail),
    })
  }

  rerun = () => {
    this.kubekeyClusterStore.patch(this.kubekeyClusterStore.detail, {
      spec: {
        rerunTrigger: new Date().getTime(),
      },
    })
  }

  handleMenuClick = (e, key) => {
    switch (key) {
      case 'edit-yaml':
        this.showEditYAML()
        break
      case 'rerun':
        this.rerun()
        break
      default:
    }
  }

  renderMenu() {
    return (
      <Menu onClick={this.handleMenuClick}>
        <Menu.MenuItem key="edit-yaml">
          <Icon name="pen" /> {t('Edit YAML')}
        </Menu.MenuItem>
        <Menu.MenuItem key="rerun">
          <Icon name="refresh" /> {t('Rerun')}
        </Menu.MenuItem>
      </Menu>
    )
  }

  render() {
    const { detail, isAgentLoading, agent } = this.props.store
    const { kkName, conditions, connectionType } = detail

    if (get(conditions, 'Initialized.status') === 'False') {
      return (
        <Panel>
          <div className={styles.title}>
            <Loading size={28} />
            <Text
              title={t('Cluster initialized failed')}
              description={get(conditions, 'Initialized.reason')}
            />
          </div>
        </Panel>
      )
    }

    if (kkName) {
      return (
        <Panel className={styles.wrapper}>
          <div className={styles.title}>
            <Text
              icon="cluster"
              title={t('CLUSTER_CREATING')}
              description={t.html('CLUSTER_CREATING_TIP')}
            />
            <div className={styles.action}>
              <Dropdown
                theme="dark"
                content={this.renderMenu()}
                placement="bottomRight"
              >
                <Button type="flat" icon="more" />
              </Dropdown>
            </div>
          </div>
          <KubeKeyCluster name={kkName} store={this.kubekeyClusterStore} />
        </Panel>
      )
    }

    return (
      <Panel className={styles.wrapper}>
        <div className={styles.title}>
          <Loading size={28} />
          <Text
            title={t.html('Waiting for the cluster to join')}
            description={t.html('CLUSTER_WAITING_JOIN_DESC')}
          />
        </div>
        {connectionType === 'proxy' && (
          <div className={styles.content}>
            <div className={styles.card}>
              <Text
                title={t.html('CLUSTER_AGENT_TIP_1')}
                description={t.html('CLUSTER_AGENT_TIP_1_DESC')}
              />
            </div>
            <div className={styles.card}>
              <Text
                className="margin-b12"
                title={t.html('CLUSTER_AGENT_TIP_2')}
                description={t.html('CLUSTER_AGENT_TIP_2_DESC')}
              />
              <Button className={styles.copy} onClick={this.handleCopy}>
                {t('Click to Copy')}
              </Button>
              <Loading spinning={isAgentLoading}>
                {agent ? (
                  <CodeEditor
                    mode="yaml"
                    className={styles.editor}
                    options={this.editOptions}
                    value={agent}
                  />
                ) : null}
              </Loading>
            </div>
            <div className={styles.card}>
              <Text
                title={t.html('CLUSTER_AGENT_TIP_3')}
                description={t.html('CLUSTER_AGENT_TIP_3_DESC')}
              />
            </div>
          </div>
        )}
        {kkName && <KubeKeyCluster name={kkName} />}
      </Panel>
    )
  }
}
