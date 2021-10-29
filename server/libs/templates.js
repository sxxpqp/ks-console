import { generateId } from './utils'

export const getUserTemplate = user => {
  const { name, email, password } = user
  return {
    apiVersion: 'iam.kubesphere.io/v1alpha2',
    kind: 'User',
    metadata: {
      name,
      annotations: {
        'iam.kubesphere.io/globalrole': 'platform-regular',
        'iam.kubesphere.io/uninitialized': 'true',
        'kubesphere.io/creator': 'admin',
      },
    },
    spec: {
      email,
      password,
    },
  }
}

export const getSpaceTemplate = space => {
  const { groupName, user, workspace } = space
  return {
    apiVersion: 'tenant.kubesphere.io/v1alpha2',
    kind: 'WorkspaceTemplate',
    metadata: {
      name: workspace || `${groupName}-${generateId()}`,
      annotations: {
        'kubesphere.io/alias-name': '',
        'kubesphere.io/creator': 'admin',
      },
    },
    spec: {
      template: {
        spec: {
          manager: user,
        },
      },
    },
  }
}

export const getProjectTemplate = ({ workspace, project, user = 'admin' }) => {
  return {
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: {
      name: project,
      labels: { 'kubesphere.io/workspace': workspace },
      annotations: { 'kubesphere.io/creator': user },
    },
  }
}

export const getSpaceRoleTemplate = ({ name, roles = [] }) => {
  return {
    apiVersion: 'iam.kubesphere.io/v1alpha2',
    kind: 'WorkspaceRole',
    rules: [],
    metadata: {
      name,
      annotations: {
        'iam.kubesphere.io/aggregation-roles': JSON.stringify(roles),
        'kubesphere.io/creator': 'admin',
      },
    },
  }
}

export const getProjectRoleTemplate = ({
  name,
  project,
  roles = [],
  rules,
  resourceVersion,
}) => {
  return {
    apiVersion: 'rbac.authorization.k8s.io/v1',
    kind: 'Role',
    metadata: {
      name,
      namespace: project,
      annotations: {
        'iam.kubesphere.io/aggregation-roles': JSON.stringify(roles),
        'kubesphere.io/creator': 'admin',
      },
      resourceVersion,
    },
    rules,
  }
}

// {
//     "apiVersion": "rbac.authorization.k8s.io/v1",
//     "kind": "Role",
//     "metadata": {
//         "namespace": "project5",
//         "name": "dd",
//         "annotations": {
//             "iam.kubesphere.io/aggregation-roles": "[\"role-template-view-snapshots\",\"role-template-view-basic\"]",
//             "kubesphere.io/creator": "liwei"
//         }
//     },
//     "rules": []
// }

// 企业空间角色信息
export const getSpaceRoleUpdateTemplate = ({
  name,
  workspace,
  roles = [],
  rules,
  resourceVersion,
}) => {
  return {
    apiVersion: 'iam.kubesphere.io/v1alpha2',
    kind: 'WorkspaceRole',
    metadata: {
      name,
      labels: {
        'kubesphere.io/workspace': workspace,
      },
      annotations: {
        'iam.kubesphere.io/aggregation-roles': JSON.stringify(roles),
        'kubesphere.io/creator': 'admin',
      },
      resourceVersion,
    },
    rules,
  }
}

// {
//     "apiVersion": "iam.kubesphere.io/v1alpha2",
//     "kind": "WorkspaceRole",
//     "rules": [],
//     "metadata": {
//         "name": "test2",
//         "labels": {
//             "kubesphere.io/workspace": "test4-namespace"
//         },
//         "annotations": {
//             "iam.kubesphere.io/aggregation-roles": "[\"role-template-view-projects\",\"role-template-view-members\",\"role-template-create-projects\",\"role-template-view-groups\",\"role-template-view-roles\",\"role-template-view-basic\"]",
//             "kubesphere.io/creator": "liwei"
//         },
//         "resourceVersion": "35287177"
//     }
// }
