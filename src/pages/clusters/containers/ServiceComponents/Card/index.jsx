import moment from 'moment-mini'
import React from 'react'
import { Link } from 'react-router-dom'
import { Columns, Column } from '@kube-design/components'
import { Status, Text } from 'components/Base'
import { getComponentStatus } from 'utils/status'

import styles from './index.scss'

const Card = ({ cluster, component = {} }) => {
  const { name, namespace } = component
  const status = getComponentStatus(component)
  const descKey = `${String(name).toUpperCase()}_DESC`
  const descText = t(descKey)

  return (
    <div className={styles.card} data-test="service-component">
      <Columns>
        <Column>
          <Text
            icon="components"
            title={
              <Link to={`/clusters/${cluster}/components/${namespace}/${name}`}>
                {name}
              </Link>
            }
            description={descText !== descKey ? <p>{descText}</p> : null}
          />
        </Column>
        <Column className="is-2">
          <Text
            title={<Status type={status} name={t(status)} />}
            description={t('Status')}
          />
        </Column>
        <Column className="is-2">
          <Text
            title={`${component.healthyBackends} / ${component.totalBackends}`}
            description={t('Replicas Number')}
          />
        </Column>
        <Column className="is-2">
          <Text
            title={
              component.startedAt
                ? moment(component.startedAt).toNow(true)
                : '-'
            }
            description={t('Running Time')}
          />
        </Column>
      </Columns>
    </div>
  )
}

export default Card
