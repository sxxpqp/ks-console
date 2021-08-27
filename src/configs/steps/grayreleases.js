import GrayReleaseBaseInfo from 'components/Forms/GrayRelease/BaseInfo'
import GrayReleaseComponents from 'components/Forms/GrayRelease/Components'
import GrayReleaseVersion from 'components/Forms/GrayRelease/Version'
import PolicyConfig from 'components/Forms/GrayRelease/PolicyConfig'

export default [
  { title: 'Basic Info', component: GrayReleaseBaseInfo, required: true },
  {
    title: 'Grayscale Release Components',
    component: GrayReleaseComponents,
    required: true,
  },
  {
    title: 'Grayscale Release Version',
    component: GrayReleaseVersion,
    required: true,
  },
  {
    title: 'Policy Config',
    component: PolicyConfig,
    required: true,
  },
]
