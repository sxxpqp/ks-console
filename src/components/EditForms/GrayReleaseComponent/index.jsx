import { get } from 'lodash'
import Base from 'components/Forms/GrayRelease/Version'

export default class GrayReleaseComponent extends Base {
  get templatePrefix() {
    return 'workload'
  }

  get isEdit() {
    return true
  }

  versionValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    const version = get(this.formTemplate, 'metadata.labels["version"]', '')

    if (value === version) {
      return callback()
    }

    const componentName = get(this.formTemplate, 'metadata.labels.app', '')

    const name = `${componentName}-${value}`
    const kind = this.workloadKind
    this.workloadStore
      .checkName({
        name,
        namespace: this.namespace,
        cluster: this.props.cluster,
      })
      .then(resp => {
        if (resp.exist) {
          return callback({
            message: t(
              `${t(kind)} ${name} ${t('exists')}, ${t(
                'version number is invalid'
              )}`
            ),
            field: rule.field,
          })
        }
        callback()
      })
  }
}
