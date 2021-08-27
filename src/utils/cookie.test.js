import cookie from './cookie'

it('cookie', () => {
  cookie('lang', 'zh')
  expect(document.cookie.indexOf('lang=zh') !== -1).toBe(true)
  expect(cookie('lang')).toBe('zh')
  expect(cookie('lang2')).toBe(null)
})
