import React from 'react'
import { ReactSortable } from 'react-sortablejs'
import { Icon, Loading } from '@kube-design/components'
import classNames from 'classnames'

import ErrorContainer from '../ErrorContainer'
import styles from './index.scss'

const ANIMATION_DURATION = 200

export default function TextPanelList({
  textPanels,
  isEditing,
  onAdd,
  onDelete,
  onEdit,
  onSort,
  monitors,
}) {
  return (
    <div>
      <ReactSortable
        list={monitors}
        setList={onSort}
        className={styles.wrapper}
        disabled={!isEditing}
        key={isEditing}
        animation={ANIMATION_DURATION}
      >
        {textPanels.map(
          ({ title, isLoading, value, id, errorMessage }, index) => (
            <div
              key={id}
              className={classNames({ [styles.editting]: isEditing })}
            >
              <ErrorContainer errorMessage={errorMessage}>
                <div className={styles.innner}>
                  {isEditing && (
                    <div className={styles.tools}>
                      <Icon
                        name={'pen'}
                        size={20}
                        type="light"
                        clickable
                        onClick={() => onEdit(index)}
                      />
                      <Icon
                        name={'trash'}
                        size={20}
                        type="light"
                        clickable
                        onClick={() => onDelete(index)}
                      />
                    </div>
                  )}
                  <div className={styles.content}>
                    <h6>{value}</h6>
                    <p>{title}</p>
                    {isLoading && (
                      <span className={styles.loadingTip}>
                        <Loading size={10} />
                      </span>
                    )}
                  </div>
                </div>
              </ErrorContainer>
            </div>
          )
        )}
      </ReactSortable>
      {isEditing && (
        <div className={styles.wrapper}>
          <div onClick={onAdd} className={styles.addButton}>
            <Icon name={'add'} size={20} type="light" />
          </div>
        </div>
      )}
    </div>
  )
}
