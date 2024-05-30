import { useEffect } from 'react'
import { useState } from 'react'
import accessCountries from './services/countries.js'
import accessWeather from './services/weather.js'

const BtnDetails = ({ country, handleShowBtn }) => <button onClick={() => handleShowBtn(country)}>show</button>

const DisplayCountry = ({ country, handleShowBtn }) => <li>{country.name.common} <BtnDetails country={country} handleShowBtn={handleShowBtn} /> </li>

const ListCountries = ({ countries, handleShowBtn }) => {
  if (countries === null) return null
  if (countries.length > 10) return <p>Too many matches, specify another filter</p>
  if (countries.length === 0) return <p>No match, specify another filter</p>
  return (
    <div>
      <ul>
        {countries.map(country =>
          <DisplayCountry
            key={country.name.common}
            country={country}
            handleShowBtn={handleShowBtn}
          />)}
      </ul>
    </div>
  )
}

const DisplayDetails = ({ country, weather }) => {
  if (country === null || weather === null) return null
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png} alt={`The flag of ${country.name.common}`} className='flag' />
      <h3>Weather in {country.capital[0]}</h3>
      <p>Temperature: {weather.current.temp} Celcius </p>
      <img src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`} alt="Weather icon" className='icon' />
      <p>Wind: {weather.current.wind_speed} m/s</p>
    </div>
  )
}

function App() {
  const [inStr, setInStr] = useState('')
  const [targetCountries, setTargetCountries] = useState(null)
  const [detailedCountry, setDetailedCountry] = useState(null)
  const [detailedWeather, setDetailedWeather] = useState(null)

  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    accessCountries
      .getAll()
      .then(countriesData => {
        const filteredCountries = countriesData.filter(country => country.name.common.toLowerCase().includes(inStr.toLowerCase()))
        setTargetCountries(filteredCountries)
        if (filteredCountries.length === 1) {
          setDetailedCountry(filteredCountries[0])
        } else {
          setDetailedCountry(null)
        }
      })
  }, [inStr])

  useEffect(() => {
    if (!!detailedCountry) {
      accessWeather
        .getWeather(detailedCountry.capitalInfo.latlng[0],detailedCountry.capitalInfo.latlng[1],api_key)
        .then(weather=>{
          setDetailedWeather(weather)
        })
    }
  }, [detailedCountry])

  const handleSubmit = event => event.preventDefault()

  const changeInStr = event => {
    const inStr = event.target.value
    setInStr(inStr)
  }

  const showDetails = country => setDetailedCountry(country)

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit} >
          <label >find countries: </label>
          <input value={inStr} onChange={changeInStr} />
        </form>
      </div>
      <ListCountries countries={targetCountries} handleShowBtn={showDetails} />
      <DisplayDetails country={detailedCountry} weather={detailedWeather} />
    </div>
  )
}

export default App
