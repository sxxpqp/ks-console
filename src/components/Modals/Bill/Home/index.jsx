import React from 'react'

import { Card } from 'components/Base'
import { Icon, Button } from '@kube-design/components'
import cookie from 'utils/cookie'
import styles from './index.scss'

export default function Home({ handleSelected, cardConfigRule }) {
  const isZH = cookie('lang') === 'zh'

  const renderCard = () => {
    return (
      cardConfigRule &&
      cardConfigRule.map(item => (
        <Card key={item.type} title={<Icon name={item.icon} size={48} />}>
          {renderContnet(item)}
        </Card>
      ))
    )
  }

  const renderContnet = ({ subTitle, desc, infos, type }) => (
    <>
      <h3 className={styles.subTitle}>{t(subTitle)}</h3>
      <p className={styles.desc}>{t(desc)}</p>
      <ul className={styles.infos} style={{ minHeight: isZH ? '25%' : '32%' }}>
        {infos.map((info, index) => (
          <li key={index}>{t.html(info)}</li>
        ))}
      </ul>
      <Button type="control" onClick={() => handleSelected(type)}>
        {t('View Consumption')}
      </Button>
    </>
  )
  const renderNav = () => {
    return (
      <div className={styles.nav}>
        <Button icon="chevron-left" iconType="light" />
        <Button icon="chevron-right" iconType="light" />
        <span className={styles.message}>{t('Select View Type')}</span>
      </div>
    )
  }
  return (
    <div className={styles.billHome}>
      <div className={styles.billHome__container}>
        {renderNav()}
        <div className={styles.container}>{renderCard()}</div>
      </div>
    </div>
  )
}
