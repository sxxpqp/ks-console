import React from 'react'
import { Icon } from '@kube-design/components'
import { Image } from 'components/Base'
import styles from './index.scss'

const BillIcon = ({ type, name, isActive = false, icon, crumb = false }) => {
  const size = crumb ? 18 : type === 'openpitrixs' ? 35 : 40

  return (
    <>
      {type === 'openpitrixs' ? (
        <div className={styles.img}>
          <Image src={null} iconLetter={name} iconSize={size} />
        </div>
      ) : (
        <Icon name={icon} size={size} type={isActive ? 'light' : 'dark'} />
      )}
    </>
  )
}

export default BillIcon
