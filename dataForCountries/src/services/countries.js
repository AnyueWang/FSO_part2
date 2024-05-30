import axios from 'axios'

const url = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () =>
    axios
        .get(`${url}/all`)
        .then(response => response.data)

export default {getAll}