const fs = require('fs');
const colors = require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

// Load model
const Person = require('./models/Person');

// Connect to db
connectDB();

// Read JSON file
const persons = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/persons.json`, 'utf-8')
);

// Operations
const importData = async () => {
  try {
    await Person.create(persons);

    console.log('Data imported...'.green.inverse);

    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Person.deleteMany();

    console.log('Data deleted...'.red.inverse);

    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// we need to run these commands in the console -> "node seeder -i" || "node seeder -d"
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
