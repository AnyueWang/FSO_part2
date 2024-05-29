import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

const Person = ({ name, number }) => <li>{name} {number}</li>

const Filter = ({ onChange, value }) =>
  <div>
    filter shown with <input onChange={onChange} value={value} id='filter' />
  </div>

const Form = ({ onSubmit, onChangeForName, valueForName, onChangeForNumber, valueForNumber }) =>
  <form onSubmit={onSubmit}>
    <div>
      name: <input onChange={onChangeForName} value={valueForName} />
    </div>
    <div>
      number: <input onChange={onChangeForNumber} value={valueForNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

const Persons = ({ persons }) =>
  <ul>
    {persons.map(person => <Person key={person.name} name={person.name} number={person.number} />)}
  </ul>

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterStr, setFilterStr] = useState('')
  const [personsToShow, setPersonsToShow] = useState(persons)

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        const data = response.data
        setPersons(data)
        setPersonsToShow(data)
      })
  }, [])

  console.log(persons)

  const addNewPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const updatedPersons = persons.concat({ name: newName, number: newNumber })
      setPersons(updatedPersons)
      setNewName('')
      setNewNumber('')
      setFilterStr('')
      setPersonsToShow(updatedPersons)
    }
  }

  const inputNewName = event => setNewName(event.target.value)
  const inputNewNumber = event => setNewNumber(event.target.value)
  const inputFilterStr = event => {
    const str = event.target.value
    setFilterStr(str)
    setPersonsToShow(persons.filter((person) => person.name.toLowerCase().includes(str.toLowerCase())))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={inputFilterStr} value={filterStr} />
      <h2>Add a new contact</h2>
      <Form
        onSubmit={addNewPerson}
        onChangeForName={inputNewName}
        valueForName={newName}
        onChangeForNumber={inputNewNumber}
        valueForNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App