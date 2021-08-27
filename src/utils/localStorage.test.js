import { getLocalStorageItem, setLocalStorageItem } from './localStorage'

it('localStorage', () => {
  expect(getLocalStorageItem('key')).toBe(null)
  setLocalStorageItem('key', 'value')
  expect(getLocalStorageItem('key')).toBe('value')
  setLocalStorageItem('key', 'value', -1)
  expect(getLocalStorageItem('key')).toBe(null)
})
