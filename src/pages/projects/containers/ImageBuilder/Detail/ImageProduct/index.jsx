import React from 'react'
import { observer } from 'mobx-react'

import { Card } from 'components/Base'
import ImageArtifactsCard from 'projects/components/Cards/ImageArtifacts'
import styles from './index.scss'

@observer
class ImageArtifacts extends React.Component {
  render() {
    const { params } = this.props.match

    return (
      <Card className={styles.main} title={t('Image Artifacts')}>
        <ImageArtifactsCard params={params} />
      </Card>
    )
  }
}

export default ImageArtifacts
