import { get } from 'lodash'
import React from 'react'
import { Button, Icon, Columns, Column } from '@kube-design/components'
import { getLocalTime } from 'utils'

import styles from './index.scss'

export default class WorkspaceCard extends React.Component {
  handleClick = () => {
    const { data, onEnter } = this.props
    onEnter && onEnter(data.name)
  }

  render() {
    const { data } = this.props

    const memberCount = Number(
      get(data, 'annotations["kubesphere.io/member-count"]', 0)
    )

    return (
      <li className={styles.wrapper} key={data.path} data-test="workspace-item">
        <div className={styles.content}>
          <Columns>
            <Column className="is-narrow">
              <img src={data.logo || '/assets/default-workspace.svg'} alt="" />
            </Column>
            <Column className="is-4">
              <div className="width-full">
                <div className="h5">
                  <a onClick={this.handleClick}>{data.name}</a>
                </div>
                <p className="ellipsis">{data.description}</p>
              </div>
            </Column>
            <Column className="is-2">
              <div>
                <p>
                  <strong>
                    {get(
                      data,
                      'annotations["kubesphere.io/namespace-count"]',
                      0
                    )}
                  </strong>
                </p>
                <p>{t('Project Number')}</p>
              </div>
            </Column>
            {globals.app.hasKSModule('devops') && (
              <Column className="is-2">
                <div>
                  <p>
                    <strong>
                      {get(
                        data,
                        'annotations["kubesphere.io/devops-count"]',
                        0
                      )}
                    </strong>
                  </p>
                  <p>{t('DevOps Project Number')}</p>
                </div>
              </Column>
            )}
            <Column className="is-2">
              <div>
                <p>
                  <strong>
                    {data.createTime
                      ? getLocalTime(data.createTime).format(
                          `YYYY-MM-DD HH:mm:ss`
                        )
                      : '-'}
                  </strong>
                </p>
                <p>{t('Created Time')}</p>
              </div>
            </Column>
          </Columns>
        </div>
        <div className={styles.footer}>
          <div className={styles.members}>
            <span>{t('Members')}:</span>
            {Array(memberCount)
              .fill('')
              .map((member, index) => {
                if (index >= 6) {
                  return null
                }

                return (
                  <img
                    key={index}
                    src="/assets/default-user.svg"
                    alt={member}
                    title={member}
                  />
                )
              })}
            {memberCount >= 6 && (
              <span className={styles.more}>
                <Icon name="more" />
              </span>
            )}
          </div>
          <div className={styles.view}>
            <Button onClick={this.handleClick} type="control">
              {t('View Workspace')}
            </Button>
          </div>
        </div>
      </li>
    )
  }
}
