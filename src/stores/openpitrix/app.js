import { action, observable } from 'mobx'
import { get } from 'lodash'

import { DEFAULT_QUERY_STATUS, SCREENSHOTS_LIMIT } from 'configs/openpitrix/app'
import Base from './base'

export default class App extends Base {
  defaultStatus = DEFAULT_QUERY_STATUS

  resourceName = 'apps'

  @observable
  showAddVersion = false

  @observable
  allApps = []

  uploadScreenshotsList = []

  @action
  upload = async ({ app_id, workspace, ...data } = {}) => {
    await request.patch(this.getUrl({ app_id, workspace }), data)
  }

  @action
  uploadBySequence = async (start, index, base64Str, screenshotStr) => {
    await this.upload({
      app_id: this.detail.app_id,
      workspace: this.detail.workspace,
      type: 'screenshot',
      attachment_content: base64Str,
      sequence: start + index,
    })

    const newScreenshots = screenshotStr
      ? `${screenshotStr},${base64Str}`
      : base64Str

    const nextIndex = index + 1
    const nextBase64Str = this.uploadScreenshotsList[nextIndex]
    if (nextBase64Str) {
      return await this.uploadBySequence(
        start,
        nextIndex,
        nextBase64Str,
        newScreenshots
      )
    }

    return newScreenshots
  }

  @action
  async deploy(params, { workspace, namespace, cluster }) {
    if (namespace) {
      await this.submitting(
        request.post(
          `${this.baseUrl}${this.getPath({
            workspace,
            namespace,
            cluster,
          })}/applications`,
          params
        )
      )
    }
  }

  @action
  uploadIcon = base64Str =>
    this.upload({
      app_id: this.detail.app_id,
      workspace: this.detail.workspace,
      type: 'icon',
      attachment_content: base64Str,
    })

  @action
  uploadScreenshot = async (base64Str, screenshotsList, index) => {
    const len = screenshotsList.length
    const total = index + len
    let screenshotStr = ''

    if (total >= SCREENSHOTS_LIMIT) {
      return false
    }

    if (index === 0) {
      this.uploadScreenshotsList = [base64Str]
      const screenshotsStr = len < 1 ? '' : screenshotsList.join(',')
      screenshotStr = await this.uploadBySequence(
        len,
        index,
        base64Str,
        screenshotsStr
      )
      return screenshotStr
    }
    this.uploadScreenshotsList.push(base64Str)
  }

  @action
  deleteScreenshot = async (index, detail) => {
    let screenshotStr = get(detail, 'screenshots', '')
    const screenshots = screenshotStr ? screenshotStr.split(',') : []

    if (index >= 0) {
      screenshots.splice(index, 1)
      screenshotStr = screenshots.join(',')

      await this.upload({
        app_id: this.detail.app_id,
        workspace: this.detail.workspace,
        type: 'screenshot',
        attachment_content: '',
        sequence: index,
      })
    } else {
      for (let i = screenshots.length - 1; i >= 0; i--) {
        await this.upload({
          app_id: this.detail.app_id,
          workspace: this.detail.workspace,
          type: 'screenshot',
          attachment_content: '',
          sequence: i,
        })
      }
      screenshotStr = ''
    }
    return screenshotStr
  }

  // data action value is: suspend、recover
  @action
  handle = async ({ app_id, workspace, ...data } = {}) => {
    const url = this.getUrl({ app_id, workspace, name: 'action' })
    return await this.submitting(request.post(url, data))
  }
}
