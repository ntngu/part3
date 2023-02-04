const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://admin:${password}@cluster0.dw00qyi.mongodb.net/?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 3) {
  console.log("Please provide password...");
  process.exit(1);
}

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected");
    if (process.argv.length === 3) {
      console.log("Phonebook");
      Person.find({}).then((persons) => {
        console.log(persons);
        mongoose.connection.close();
      });
    } else {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      });
      console.log(
        `added ${process.argv[2]} number ${process.argv[3]} to phonebook`
      );
      return person.save();
    }
  })
  .then((result) => {
    if (result !== undefined) {
      mongoose.connection.close();
    }
  });
