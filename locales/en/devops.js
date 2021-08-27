module.exports = {
  'Create DevOps Project': 'Create DevOps Project',
  'Delete DevOps Project': 'Delete DevOps Project',
  'DevOps Basic Info': 'DevOps Basic Information',
  'DevOps Credentials': 'DevOps Credentials',
  'DevOps Member': 'DevOps Member',
  'DevOps Members': 'DevOps Members',
  'DevOps Name': 'DevOps Name',
  'DevOps Project': 'DevOps Project',
  'DevOps Project Manager': 'DevOps Project Manager',
  'DevOps Role': 'DevOps Role',
  'DevOps Roles': 'DevOps Roles',
  Manager: 'Manager',

  DEVOPS_PROJECT_MANAGEMENT: 'Project Management',
  DEVOPS_PROJECT_MEMBERS: 'Project Members',
  DEVOPS_PROJECT_ROLES: 'Project Roles',

  DEVOPS_BASEINFO_DESC:
    'Please input the basic information of the DevOps project',

  DEVOPS_DESCRIPTION:
    'DevOps is a separate namespace that defines a set of pipelines. Users can group their pipelines themselves (for example, project type and organization type).',
  DEVOPS_PROJECT_CREATE_DESC:
    'DevOps is a separate namespace that defines a set of pipelines. Users can group their pipelines themselves (for example, project type and organization type).',

  DEVOPS_ADMIN_DESC:
    'You can specify a member of the project as an administrator',

  NO_RELATE_DEVOPS_TITLE: 'No DevOps project associated with you',
  NO_RELATE_DEVOPS_DESC:
    'You can create or contact the project manager to invite you to the DevOps project to start your work.',

  DEVOPS_PROJECT_CREDENTIALS_DESC:
    'Credentials are objects that contain some sensitive data, such as username and password, SSH key and Token. They are used to provide authentication for pulling code, pushing/pulling images, executing SSH scripts, etc. when a pipeline is running.',

  DEVOPS_PROJECT_ROLES_DESC:
    'The project roles define the permissions that users have under the current DevOps project.',
  DEVOPS_PROJECT_MEM_DESC: 'Manage and assign roles to project members',

  DELETE_DEVOPS_TIP:
    'Are you sure you want to delete the DevOps project <strong>{resource}</strong>? After the deletion, you will not be able to recover it, and the resources in the DevOps project will also be removed.',

  DEVOPS_TIP_GITOPS_Q: 'How do I get started with GitOps?',
  DEVOPS_TIP_GITOPS_A:
    'You can start using GitOps by creating a pipeline that is associated with the code repository and deploying steps with Kubernetes.',

  DEVOPS_TIP_TYPE_Q: 'Which code repositories are supported by pipelines?',
  DEVOPS_TIP_TYPE_A:
    'Pipelines support code repositories of Git, GitHub, Gitlab, SVN, and Bitbucket.',

  NO_DEVOPS_INSTALL: 'DevOps not installed',
}
