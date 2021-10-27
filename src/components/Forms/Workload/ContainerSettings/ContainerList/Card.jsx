import React from 'react'
import PropTypes from 'prop-types'
// import { get, isEmpty } from 'lodash'

// import { Icon, Tag } from '@kube-design/components'
import { Tag } from '@kube-design/components'
import { List } from 'components/Base'
// import { cpuFormat, memoryFormat } from 'utils'

// import styles from './index.scss'

const Card = ({ type = 'worker', container, onDelete, onEdit, readOnly }) => {
  const handleDelete = () => onDelete({ type, ...container })
  const handleEdit = () => onEdit({ type, ...container })
  // const limits = get(container, 'resources.limits', {})
  // const requests = get(container, 'resources.requests', {})

  const isIstioProxy = container.name === 'istio-proxy'

  if (isIstioProxy) {
    return (
      <List.Item
        icon="istio"
        title={container.name}
        description={`${t('Image')}: ${container.image}`}
      />
    )
  }

  // let extras
  // if (isEmpty(limits) && isEmpty(requests)) {
  //   extras = (
  //     <div className={styles.limits}>
  //       <Icon name="exclamation" />
  //       <span>&nbsp;{t('No resource limits')}</span>
  //     </div>
  //   )
  // } else {
  //   extras = (
  //     <div className={styles.limits}>
  //       {(limits.cpu || requests.cpu) && (
  //         <span className={styles.limit}>
  //           <Icon name="cpu" size={20} />
  //           <span>{`${requests.cpu ? cpuFormat(requests.cpu) : 0} ~ ${
  //             limits.cpu ? cpuFormat(limits.cpu) : '∞'
  //           }`}</span>
  //         </span>
  //       )}
  //       {(limits.memory || requests.memory) && (
  //         <span className={styles.limit}>
  //           <Icon name="memory" size={20} />
  //           {`${requests.memory ? `${memoryFormat(requests.memory)}Mi` : 0} ~ ${
  //             limits.memory ? `${memoryFormat(limits.memory)}Mi` : '∞'
  //           }`}
  //         </span>
  //       )}
  //     </div>
  //   )
  // }

  const title =
    type === 'init' ? (
      <span>
        {container.name}
        <Tag className="margin-l8" type="warning">
          {t('Init Container')}
        </Tag>
      </span>
    ) : (
      container.name
    )

  return (
    <List.Item
      icon="docker"
      title={title}
      description={`${t('Image')}: ${container.image}`}
      // extras={extras}
      showBtns
      onDelete={!readOnly && handleDelete}
      onEdit={!readOnly && handleEdit}
    />
  )
}

Card.propTypes = {
  container: PropTypes.object,
}

export default Card
