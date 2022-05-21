import axios from 'axios'

const axiosAPI = axios.create({
    baseURL: '/api/',
})

export const example = () => {
    return axiosAPI.get('')
        .then((res) => {
            return res.data
        })
} 

export const playSong = (id) => {
    return axiosAPI.get('play-song', {  params: { id }})
        .then((res) => {
            return res.data
        })
} 
export const search = (query) => {
    return axiosAPI.get('search', { params: { query } })
        .then((res) => {
            return res.data
        })
} 