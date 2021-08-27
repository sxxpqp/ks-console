import React from 'react'
import { Form, Icon, Select } from '@kube-design/components'
import { Text, CodeEditor } from 'components/Base'
import { getDocsUrl } from 'utils'

import { get } from 'lodash'
import Title from '../Title'
import styles from './index.scss'

export default class Confiuguration extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      connectType: get(props.formTemplate, 'spec.connection.type', 'direct'),
    }
  }

  get types() {
    return [
      {
        label: t('CONNTECT_DIRECT'),
        value: 'direct',
      },
      {
        label: t('CONNTECT_PROXY'),
        value: 'proxy',
      },
    ]
  }

  get editOptions() {
    return {
      width: '100%',
      height: '100%',
    }
  }

  handleTypeChange = type => {
    this.setState({ connectType: type })
  }

  render() {
    const { formRef, formTemplate } = this.props
    const { connectType } = this.state
    return (
      <div>
        <Title
          title={t('Cluster Settings')}
          description={t('CLUSTER_SETTINGS_DESC')}
        />
        <Form data={formTemplate} ref={formRef}>
          <Form.Item
            label={t('Connection Method')}
            desc={t('CLUSTER_CONNECT_METHOD_DESC')}
          >
            <Select
              name="spec.connection.type"
              options={this.types}
              onChange={this.handleTypeChange}
            />
          </Form.Item>
          {connectType === 'direct' && (
            <div className={styles.tip}>
              {t.html('CLUSTER_DIRECT_IMPORT_TIP')}
            </div>
          )}
          {connectType === 'direct' ? (
            <div className={styles.editorWrapper}>
              <div className={styles.editor}>
                <div className={styles.editorTitle}>
                  <Icon name="kubernetes" size={20} />
                  <span>{t('INPUT_KUBECONFIG')}</span>
                  <a
                    className={styles.link}
                    href={getDocsUrl('kube_config')}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {t('HOW_TO_GET_KUBECONFIG')}
                  </a>
                </div>
                <Form.Item
                  rules={[{ required: true, message: t('INPUT_KUBECONFIG') }]}
                  unControl
                >
                  <CodeEditor
                    mode="yaml"
                    name="spec.connection.kubeconfig"
                    className={styles.editor}
                    options={this.editOptions}
                  />
                </Form.Item>
              </div>
            </div>
          ) : (
            <div className={styles.tip}>
              <Text
                title={t('CLUSTER_AGENT_TITLE')}
                description={t('CLUSTER_AGENT_DESC')}
              />
              <div className="margin-t12">
                {t.html('CLUSTER_AGENT_IMPORT_TIP')}
              </div>
            </div>
          )}
        </Form>
      </div>
    )
  }
}
