import LanguageSelect from 'components/Forms/ImageBuilder/LanguageSelect'
import S2IForm from 'components/Forms/ImageBuilder/S2IForm'

export default [
  {
    title: 'Choose a Language',
    component: LanguageSelect,
  },
  {
    title: 'Build Settings',
    component: S2IForm,
    required: true,
  },
]
