import axios from 'axios'

export const applyRes = params => axios.post('/apply', params)

export const getApply = params => axios.get('/apply', params)
