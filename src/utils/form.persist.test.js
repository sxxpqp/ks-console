import formPersist from './form.persist'

it('getLanguageIcon', () => {
  const testData = { a: 'b' }

  formPersist.set('create', testData)
  expect(formPersist.get('create')).toStrictEqual(testData)
  formPersist.delete('create')
  expect(formPersist.get('create')).toStrictEqual(undefined)
})
