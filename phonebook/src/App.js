import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/person";
import Notification from "./components/Notification";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setNewFilter] = useState("");
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    if (newName === "" || newNumber === "") {
      setMessage("Please enter a name or number...");
      setSuccess("error");
      setTimeout(() => {
        setMessage(null);
        setSuccess("");
      }, 5000);
    } else if (persons.find((person) => newName === person.name)) {
      const temp = persons.find((person) => newName === person.name);
      const changedPerson = { ...temp, number: newNumber };
      if (
        window.confirm(
          `${changedPerson.name} is already in the phonebook, update number?`
        )
      ) {
        personService
          .update(changedPerson.id, changedPerson)
          .catch((error) => {
            setSuccess("error");
            setMessage(`${changedPerson.name} could not be updated...`);
            setTimeout(() => {
              setMessage(null);
              setSuccess("");
            }, 5000);
          })
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== returnedPerson.id ? person : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
            setSuccess("success");
            setMessage(`${returnedPerson.name} updated...`);
            setTimeout(() => {
              setMessage(null);
              setSuccess("");
            }, 5000);
          });
      }
    } else {
      const personObject = {
        id: persons.length + 1,
        name: newName,
        number: newNumber,
      };
      personService.create(personObject).then(
        setPersons(persons.concat(personObject)),
        setNewName(""),
        setNewNumber(""),
        setSuccess("success"),
        setMessage(`${personObject.name} added...`),
        setTimeout(() => {
          setMessage(null);
          setSuccess("");
        }, 5000)
      );
    }
  };

  const removePerson = (person) => {
    if (window.confirm(`Do you want to remove ${person.name}?`)) {
      personService
        .remove(person.id)
        .catch((error) => {
          setSuccess("error");
          setMessage(`${person.name} was already removed...`);
          setTimeout(() => {
            setMessage(null);
            setSuccess("");
          }, 5000);
        })
        .then(
          setPersons(persons.filter((p) => p.id !== person.id)),
          setSuccess("success"),
          setMessage(`${person.name} removed...`),
          setTimeout(() => {
            setMessage(null);
            setSuccess("");
          }, 5000)
        );
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} success={success}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} remove={removePerson} />
    </div>
  );
};

export default App;
