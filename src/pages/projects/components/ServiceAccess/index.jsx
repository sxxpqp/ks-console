import React from 'react'
import { Notify } from '@kube-design/components'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { Text } from 'components/Base'
// import { Button } from 'antd'

export default function ServiceAccess({ data, showCopy = false }) {
  if (data.specType === 'ClusterIP') {
    return <Text description={data.specType} title={data.clusterIP} />
  }

  if (data.specType === 'NodePort') {
    const handleCopy = () => {
      Notify.success({
        content: t('Copy Successfully'),
      })
    }

    const ports = data.ports
      .filter(port => port.nodePort)
      .map(port => {
        const link = `${globals.config.url.base}:${port.nodePort}`
        return (
          <div>
            <span>
              {port.port}:
              <a href={link} target="_blank" style={{ color: '#55bc8a' }}>
                {port.nodePort}
              </a>
              /{port.protocol}
            </span>
            {showCopy && (
              <CopyToClipboard text={link} onCopy={handleCopy}>
                <a href="#" style={{ color: '#55bc8a', paddingLeft: '15px' }}>
                  {t('Copy')}
                </a>
              </CopyToClipboard>
            )}
          </div>
        )
      })
    // .join(';')
    // const ports = data.ports
    //   .filter(port => port.nodePort)
    //   .map(port => `${port.port}:${port.nodePort}/${port.protocol} `)
    //   .join(';')

    return (
      <>
        <Text description="端口映射" title={ports} />
      </>
    )
  }

  if (data.specType === 'LoadBalancer') {
    return (
      <Text
        description={data.specType}
        title={data.loadBalancerIngress.join('; ')}
      />
    )
  }

  return <Text description={data.specType} title={data.externalName} />
}
