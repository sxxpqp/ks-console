import { isEmpty } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon } from '@kube-design/components'
import { getDisplayName } from 'utils'

import styles from './index.scss'

const Card = ({ detail, gateway, prefix }) => {
  const ports = {}
  if (gateway && gateway.ports && gateway.type === 'NodePort') {
    gateway.ports.forEach(_port => {
      if (_port.name === 'http' && _port.nodePort !== 80) {
        ports.http = _port.nodePort
      }
      if (_port.name === 'https' && _port.nodePort !== 443) {
        ports.https = _port.nodePort
      }
    })
  }

  if (isEmpty(detail.rules)) {
    return null
  }

  const tls = detail.tls || []
  const detailName = getDisplayName(detail)

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <Icon name="loadbalancer" size={40} />
        <div className={styles.text}>
          <Link to={`${prefix}/ingresses/${detail.name}`}>{detailName}</Link>
          <p>hostname: {detail.rules.map(rule => rule.host).join(', ')}</p>
        </div>
      </div>
      <ul className={styles.rules}>
        {detail.rules.map(rule => {
          const protocol =
            tls.hosts && tls.hosts.includes(rule.host) ? 'https' : 'http'
          let host = `${protocol}://${rule.host}`
          if (ports[protocol]) {
            host = `${host}:${ports[protocol]}`
          }

          return rule.http.paths.map(path => (
            <li key={`${rule.host}${path.path}`}>
              <span>
                {t('Url')}
                :&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
              <span>
                <strong>
                  {host}
                  {path.path}
                </strong>
              </span>
              <a
                href={`${host}${path.path}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button className={styles.access}>{t('Click to visit')}</Button>
              </a>
            </li>
          ))
        })}
      </ul>
    </div>
  )
}

Card.propTypes = {
  rule: PropTypes.object,
}

export default Card
