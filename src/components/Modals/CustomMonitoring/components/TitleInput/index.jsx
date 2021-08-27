import React from 'react'
import { Input } from '@kube-design/components'
import classnames from 'classnames'
import styles from './index.scss'

export default function TitleInput({ title, isEditing, onChange, theme }) {
  return (
    <div
      className={classnames(styles.wrapper, {
        [styles.dark]: theme === 'dark',
      })}
    >
      {isEditing ? (
        <Input
          onChange={onChange}
          value={title}
          placeholder={t('Dashboard Title')}
        />
      ) : (
        <span
          className={classnames(styles.title, {
            [styles.dark]: theme === 'dark',
          })}
        >
          {title}
        </span>
      )}
    </div>
  )
}
