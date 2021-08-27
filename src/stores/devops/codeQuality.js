import { isArray } from 'lodash'
import { action, observable } from 'mobx'
import ObjectMapper from 'utils/object.mapper'
import BaseStore from './base'

export default class CodeQualityStore extends BaseStore {
  @observable
  detail = {}

  @observable
  isLoading = true

  @action
  fetchDetail = async ({ devops, branch, name, cluster }) => {
    let url = ''
    if (branch) {
      url = `${this.getDevopsUrlV2({
        cluster,
      })}${devops}/pipelines/${name}/branches/${encodeURIComponent(
        branch
      )}/sonarstatus `
    } else {
      url = `${this.getDevopsUrlV2({
        cluster,
      })}${devops}/pipelines/${name}/sonarstatus`
    }
    this.isLoading = true
    const result = await this.request
      .get(url, null, null, () => 'no  sonarqube')
      .finally(() => {
        this.isLoading = false
      })
    const _result = isArray(result) ? result : []
    this.detail = _result.length ? _result.map(ObjectMapper.codequality)[0] : {}
  }
}
