const mongoose = require('mongoose');
const colors = require('colors');

// The minimum length is 3 with the password being the 3d argument. Name and number should only be added if we wanted to add a new person to the phonebook. Otherwise the list of person objects will be printed to the console.
if (process.argv.length < 3) {
  console.log(
    'FAILED!'.red.bold,
    'Please provide your password: $ node mongo.js <password> <name> <number>'
  );
  process.exit(1);
}

// Retrieving the console input values
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

// Connect to the DB
const url = `mongodb+srv://zoltanSzokodi:${password}@the-phonebook-jxkvc.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create the person schema
const personSchema = mongoose.Schema({
  name: String,
  number: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Person model based on the schema
const Person = mongoose.model('Person', personSchema);

// If there was only a password entered print the list of all person objects to the console
if (process.argv.length === 3) {
  Person.find({}).then(res => {
    res.forEach(person => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  // Instantiate a new Person based on the console input data
  const person = new Person({
    name,
    number,
  });

  person.save().then(res => {
    console.log(
      'SUCCESS!'.green.bold,
      `Added ${name} with number ${number} to phonebook`
    );
    mongoose.connection.close();
  });
}
