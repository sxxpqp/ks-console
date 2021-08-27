import { getLanguageIcon, groovyToJS } from './devops'

it('getLanguageIcon', () => {
  expect(getLanguageIcon('rust', 'none')).toBe('none')
  expect(getLanguageIcon('nodejs', 'none')).toBe('nodejs')
})

it('groovyToJS', () => {
  const result = groovyToJS(
    // eslint-disable-next-line no-template-curly-in-string
    "${[usernamePassword(credentialsId : 'admin' ,passwordVariable : 'password' ,usernameVariable : 'username' ,)]}"
  )
  expect(Object.keys(result)).toHaveLength(3)

  const result1 = groovyToJS(
    "[$class: 'SubversionSCM', locations: [[cancelProcessOnExternalsFail: true,  credentialsId: 'admin', depthOption: 'infinity', ignoreExternalsOption: true, local: '.', remote: 'http://git.kubesphere.io/']], quietOperation: true, workspaceUpdater: [$class: 'UpdateUpdater']]"
  )
  expect(Object.keys(result1)).toHaveLength(10)
  expect(result1.remote).toBe('http://git.kubesphere.io/')
  expect(JSON.stringify(groovyToJS(''))).toBe('{}')
})
