import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon, Columns, Column, Tooltip } from '@kube-design/components'
import { Text } from 'components/Base'

import styles from './index.scss'

const Card = ({ gateway, rule, tls = {}, prefix }) => {
  const protocol = tls.hosts && tls.hosts.includes(rule.host) ? 'https' : 'http'

  let host = rule.host
  if (gateway && gateway.ports && gateway.type === 'NodePort') {
    const _port = gateway.ports.find(item => item.name === protocol)
    if (
      _port &&
      ((protocol === 'http' && _port.nodePort !== 80) ||
        (protocol === 'https' && _port.nodePort !== 443))
    ) {
      host = `${host}:${_port.nodePort}`
    }
  }

  const description = (
    <>
      <span>
        {t('Protocol')}: {protocol}
      </span>
      &nbsp;&nbsp;
      {protocol === 'https' && (
        <span>
          {t('Certificate')}: {tls.secretName}
        </span>
      )}
    </>
  )

  return (
    <div className={styles.card}>
      <span className={styles.tip}>
        {t('Unable to access')}
        &nbsp;&nbsp;
        <Tooltip content={t.html('UNABLE_TO_ACCESS_TIP')}>
          <Icon name="question" />
        </Tooltip>
      </span>
      <Text icon="ip" title={host} description={description} />
      {rule.http.paths.map(path => (
        <div key={path.path} className={styles.path}>
          <Columns>
            <Column>
              <span>
                {t('path')}: <strong>{path.path}</strong>
              </span>
            </Column>
            <Column>
              <span>
                {t('Service')}:{' '}
                <strong>
                  <Link to={`${prefix}/services/${path.backend.serviceName}`}>
                    {path.backend.serviceName}
                  </Link>
                </strong>
              </span>
            </Column>
            <Column>
              <span>
                {t('Port')}: <strong>{path.backend.servicePort}</strong>
              </span>
            </Column>
            <Column>
              <a
                href={`${protocol}://${host}${path.path}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button className={styles.access}>{t('Click to visit')}</Button>
              </a>
            </Column>
          </Columns>
        </div>
      ))}
    </div>
  )
}

Card.propTypes = {
  rule: PropTypes.object,
}

export default Card
