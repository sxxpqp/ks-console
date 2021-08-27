import React from 'react'

import ClustersMapper from './ClustersMapper'
import ContainersMapper from './ContainersMapper'
import ContainerImages from './ContainerImages'
import ContainerPorts from './ContainerPorts'

import styles from './index.scss'

export default class AdvancedSettings extends React.Component {
  get showContainerSettings() {
    const { overrides } = this.props

    return overrides.some(ord =>
      ord.clusterOverrides.some(cod => cod.path.indexOf('image') !== -1)
    )
  }

  get showServiceSettings() {
    const { overrides } = this.props

    return overrides.some(ord =>
      ord.clusterOverrides.some(cod => cod.path.indexOf('ports') !== -1)
    )
  }

  render() {
    const { workload, clusters, overrides } = this.props

    return (
      <div>
        {this.showContainerSettings && (
          <>
            <div className={styles.title}>{t('Container Image')}</div>
            <ClustersMapper clusters={clusters} overrides={overrides}>
              {props => (
                <ContainersMapper formTemplate={workload} {...props}>
                  {containerProps => <ContainerImages {...containerProps} />}
                </ContainersMapper>
              )}
            </ClustersMapper>
          </>
        )}
        {this.showServiceSettings && (
          <>
            <div className={styles.title}>{t('Service Settings')}</div>
            <ClustersMapper clusters={clusters} overrides={overrides}>
              {props => (
                <ContainersMapper formTemplate={workload} {...props}>
                  {containerProps => <ContainerPorts {...containerProps} />}
                </ContainersMapper>
              )}
            </ClustersMapper>
          </>
        )}
      </div>
    )
  }
}
