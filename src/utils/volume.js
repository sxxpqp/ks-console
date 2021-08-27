import { get } from 'lodash'

export const getVolumeType = volume => {
  if (volume.persistentVolumeClaim) {
    return 'Volume'
  }
  if (volume.hostPath) {
    return 'HostPath'
  }
  if (volume.emptyDir) {
    return 'EmptyDir'
  }
}

export const isNotPersistentVolume = volume =>
  volume.emptyDir || volume.hostPath || volume.configMap || volume.secret

export const findVolume = (volumes, newVolume) => {
  let volume

  if (!newVolume) {
    return volume
  }

  if (isNotPersistentVolume(newVolume)) {
    volume = volumes.find(item => item.name === newVolume.name)
  } else {
    volume = volumes.find(
      item => get(item, 'persistentVolumeClaim.claimName') === newVolume.name
    )
  }

  return volume
}
