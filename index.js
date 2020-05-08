const express = require('express');
const dotenv = require('dotenv');

// This ensures that the environment variables from the .env file are available globally before the code from the other modules are imported
dotenv.config({ path: './config/config.env' });

const connectDB = require('./config/db');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/Person');

// let persons = [
//   {
//     name: 'Arto Hellas',
//     number: '040-123456',
//     id: 1,
//   },
//   {
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//     id: 2,
//   },
//   {
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//     id: 3,
//   },
//   {
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//     id: 4,
//   },
// ];

const app = express();
connectDB();

// Body parser
app.use(express.json());
// CORS
app.use(cors());
// Serve static folder
app.use(express.static('build'));

// Only run morgan in development mode
if (process.env.NODE_ENV === 'development') {
  // Morgan customized to log req.body on post requests
  morgan.token('req-body', req => {
    if (req.method === 'POST') return JSON.stringify(req.body);
    return null;
  });
  app.use(morgan(`:method :url :status - :response-time ms :req-body`));
}

// ROUTES =========================================
app.get('/api/persons', async (req, res) => {
  try {
    const persons = await Person.find({});
    res.send(persons);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Something went wrong',
    });
  }
});

app.get('/api/persons/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);

    if (!person) return res.status(404).end();

    res.send(person);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Something went wrong',
    });
  }
});

app.post('/api/persons', async (req, res) => {
  try {
    const { name, number } = req.body;

    if (!name || name.length < 1)
      return res.status(400).json({ error: 'Please provide a name' });
    if (!number || number.length < 1)
      return res.status(400).json({ error: 'Please provide a number' });

    const person = await Person.create(req.body);

    res.send(person);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Something went wrong',
    });
  }
});

app.delete('/api/persons/:id', async (req, res) => {
  try {
    await Person.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: 'Something went wrong',
    });
  }
});

// SERVER =======================================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);
