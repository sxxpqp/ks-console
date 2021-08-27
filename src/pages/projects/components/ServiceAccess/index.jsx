import React from 'react'

import { Text } from 'components/Base'

export default function ServiceAccess({ data }) {
  if (data.specType === 'ClusterIP') {
    return <Text description={data.specType} title={data.clusterIP} />
  }

  if (data.specType === 'NodePort') {
    return (
      <Text
        description={data.specType}
        title={data.ports
          .filter(port => port.nodePort)
          .map(port => `${port.port}:${port.nodePort}/${port.protocol}`)
          .join(';')}
      />
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
