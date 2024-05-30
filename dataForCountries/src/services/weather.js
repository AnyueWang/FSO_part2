import axios from 'axios'

const url = 'https://api.openweathermap.org/data/3.0/onecall?'

const getWeather = (lat, lon, api_key) =>
    axios
        .get(`${url}lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
        .then(response => response.data)

export default {getWeather}