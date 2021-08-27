import { action } from 'mobx'

import MemberList from 'stores/member.list'

import Base from '../base'

export default class ProjectMemberStore extends Base {
  list = new MemberList()

  getResourceUrl = ({ namespace }) =>
    `kapis/iam.kubesphere.io/v1alpha2/namespaces/${namespace}/users`

  @action
  addMember(namespace, name, role) {
    return request.post(
      `apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/rolebindings`,
      {
        kind: 'RoleBinding',
        apiVersion: 'rbac.authorization.k8s.io/v1',
        metadata: {
          name: `${role}-${name}`,
        },
        subjects: [
          {
            kind: 'User',
            apiGroup: 'rbac.authorization.k8s.io',
            name,
          },
        ],
        roleRef: {
          apiGroup: 'rbac.authorization.k8s.io',
          kind: 'Role',
          name: role,
        },
      }
    )
  }

  @action
  deleteMember(namespace, member) {
    return this.submitting(
      request.delete(
        `apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/rolebindings/${member.role_binding}`
      )
    )
  }

  @action
  batchDeleteMembers(namespace, rowKeys) {
    return this.submitting(
      Promise.all(
        rowKeys.map(rowKey => {
          const member = this.members.data.find(
            user => user.username === rowKey
          )
          return request.delete(
            `apis/rbac.authorization.k8s.io/v1/namespaces/${namespace}/rolebindings/${member.role_binding}`
          )
        })
      )
    )
  }

  @action
  async changeMemberRole(namespace, member, newRole) {
    await this.deleteMember(namespace, member)
    await this.addMember(namespace, member.username, newRole)
  }
}
