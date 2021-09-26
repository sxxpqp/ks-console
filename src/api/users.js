import axios from 'axios'

export const getMenus = params => axios.get('/getMenus', params)

export const addMenu = params => axios.post('/addMenu', params)

export const editMenu = params => axios.post('/editMenu', params)

export const removeMenu = params => axios.post('/removeMenu', params)
