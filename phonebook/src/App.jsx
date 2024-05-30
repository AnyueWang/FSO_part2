import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import accessPersons from './services/persons'

const Person = ({ person, handleDelBtn }) => <li>
  {person.name} {person.number} <button onClick={() => handleDelBtn(person)}>delete</button>
</li>

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

const Persons = ({ persons, handleDelBtn }) =>
  <ul>
    {persons.map(person => <Person key={person.name} person={person} handleDelBtn={handleDelBtn} />)}
  </ul>

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterStr, setFilterStr] = useState('')
  const [personsToShow, setPersonsToShow] = useState(persons)

  useEffect(() => {
    accessPersons
      .getAll()
      .then(dataPersons => {
        setPersons(dataPersons)
        setPersonsToShow(dataPersons)
      })
  }, [])

  const refreshDisplayList = persons => {
    setPersons(persons)
    setNewName('')
    setNewNumber('')
    setFilterStr('')
    setPersonsToShow(persons)
  }

  const addNewPerson = (event) => {
    event.preventDefault()
    const targetPerson = persons.find(person => person.name === newName)
    if (!!targetPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        accessPersons.changeNumber(targetPerson, newNumber)
          .then(updatedPerson => {
            const updatedPersons = persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson)
            refreshDisplayList(updatedPersons)
          })
      }
    } else {
      const newPerson = { name: newName, number: newNumber }
      accessPersons.create(newPerson)
        .then(addedPerson => {
          const updatedPersons = persons.concat(addedPerson)
          refreshDisplayList(updatedPersons)
        })
    }
  }

  const inputNewName = event => setNewName(event.target.value)
  const inputNewNumber = event => setNewNumber(event.target.value)
  const inputFilterStr = event => {
    const str = event.target.value
    setFilterStr(str)
    setPersonsToShow(persons.filter((person) => person.name.toLowerCase().includes(str.toLowerCase())))
  }
  const deletePerson = targetPerson => {
    if (window.confirm(`Delete ${persons.find(person => person.id === targetPerson.id).name}?`)) {
      accessPersons
        .remove(targetPerson)
        .then(deletedPerson => {
          const updatedPersons = persons.filter(person => person.id !== deletedPerson.id)
          refreshDisplayList(updatedPersons)
        })
    } else {

    }
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
      <Persons persons={personsToShow} handleDelBtn={deletePerson} />
    </div>
  )
}

export default App