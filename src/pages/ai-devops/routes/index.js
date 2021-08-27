import Layout from '../containers/layout'
import CredentialDetail from '../containers/Credential/detail'
import PipelineDetail from '../containers/Pipelines/Detail/layout'

const PATH = '/:workspace/clusters/:cluster/devops'

export default [
  {
    path: PATH,
    component: Layout,
    routes: [
      {
        path: `${PATH}/:devops/pipelines/:name`,
        component: PipelineDetail,
      },
      {
        path: `${PATH}/:devops/credentials/:credential_id`,
        component: CredentialDetail,
      },
    ],
  },
]
