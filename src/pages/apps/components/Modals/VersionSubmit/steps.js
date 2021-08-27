import TestSteps from 'apps/components/Cards/TestSteps'
import VersionEdit from 'apps/components/Forms/VersionEdit'

export default [
  {
    title: 'Test Steps',
    icon: 'cdn',
    component: TestSteps,
    value: 'testSteps',
    required: true,
  },
  {
    title: 'Update Log',
    icon: 'update',
    component: VersionEdit,
    value: 'updateLog',
    required: true,
  },
]
