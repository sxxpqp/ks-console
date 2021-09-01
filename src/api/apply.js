import axios from 'axios'

export const applyRes = params => axios.post('/apply', params)
