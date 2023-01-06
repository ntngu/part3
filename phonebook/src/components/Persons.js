const Persons = ({ persons, filter, remove }) => {
  const personsToShow = () => {
    if (filter !== "") {
      return persons.filter((person) =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return persons;
  };

  return (
    <div>
      {personsToShow().map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => remove(person)}>remove</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;
