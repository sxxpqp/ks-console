import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { Columns, Column } from '@kube-design/components'
import { Card } from 'components/Base'

import styles from './index.scss'

export default class Annotations extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  render() {
    const { className, data } = this.props

    if (isEmpty(data)) return null

    return (
      <Card className={className} title={t('Annotations')}>
        <ul className={styles.annotations}>
          {Object.keys(data)
            .filter(key => !isEmpty(data[key]))
            .map(key => (
              <li key={key}>
                <Columns>
                  <Column className="is-narrow">
                    <p style={{ width: 317 }}>{key}</p>
                  </Column>
                  <Column>
                    <p>{data[key]}</p>
                  </Column>
                </Columns>
              </li>
            ))}
        </ul>
      </Card>
    )
  }
}
