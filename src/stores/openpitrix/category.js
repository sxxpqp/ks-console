import { action } from 'mobx'

import Base from './base'

export default class Category extends Base {
  resourceName = 'categories'

  getUrl = ({ category_id } = {}) => {
    if (category_id) {
      return `${this.baseUrl}/${this.resourceName}/${category_id}`
    }

    return `${this.baseUrl}/${this.resourceName}`
  }

  @action
  update = async ({ category_id, ...data } = {}) => {
    await this.submitting(request.patch(this.getUrl({ category_id }), data))
  }

  @action
  delete = ({ category_id }) =>
    this.submitting(request.delete(this.getUrl({ category_id }), {}))
}
