import React from 'react'

import { Columns, Column } from '@kube-design/components'

import styles from './index.scss'

const TaintCard = ({ data }) => (
  <div className={styles.card}>
    <Columns>
      <Column>
        <p>
          <span>key: </span> {data.key}
        </p>
      </Column>
      <Column>
        <p>
          <span>value: </span> {data.value}
        </p>
      </Column>
      <Column>
        <p>
          <span>effect: </span> {data.effect}
        </p>
      </Column>
    </Columns>
  </div>
)

export default TaintCard
