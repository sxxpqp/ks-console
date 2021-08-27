import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'

import LabelsCard from 'components/Cards/Labels'
import AnnotationsCard from 'components/Cards/Annotations'

@inject('detailStore')
@observer
export default class Metadata extends React.Component {
  get store() {
    return this.props.detailStore
  }

  render() {
    const { labels, annotations } = toJS(this.store.detail)
    return (
      <>
        <LabelsCard labels={labels} />
        <AnnotationsCard annotations={annotations} />
      </>
    )
  }
}
