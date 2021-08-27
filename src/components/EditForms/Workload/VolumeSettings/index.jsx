import { Component as Base } from 'components/Forms/Workload/VolumeSettings'

export default class VolumeSettings extends Base {
  handleVolume = (...args) => {
    Base.prototype.handleVolume.apply(this, args)

    this.props.formProps.onChange()
  }

  handleVolumeTemplate = (...args) => {
    Base.prototype.handleVolumeTemplate.apply(this, args)

    this.props.formProps.onChange()
  }

  handleLogToggle = () => {
    Base.prototype.handleLogToggle.apply(this)

    this.props.formProps.onChange()
  }
}
