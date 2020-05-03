const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

dotenv.config({ path: './config/config.env' });

// Only run morgan in development mode
if (process.env.NODE_ENV === 'development') {
  // Morgan customized to log req.body on post requests
  morgan.token('req-body', function getBody(req) {
    if (req.method === 'POST') return JSON.stringify(req.body);
    return null;
  });
  app.use(morgan(`:method :url :status - :response-time ms :req-body`));
}

// ROUTES =========================================
app.get('/api/persons', (req, res) => {
  res.send(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const contact = persons.find(cont => cont.id === id);

  if (!contact) return res.status(404).end();

  res.send(contact);
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || name.length < 1)
    return res.status(400).json({ error: 'Please provide a name' });
  if (!number || number.length < 1)
    return res.status(400).json({ error: 'Please provide a number' });

  const nameTaken = persons.find(cont => cont.name === name);
  const numberTaken = persons.find(cont => cont.number === number);

  if (nameTaken) return res.status(400).json({ error: 'Name already taken' });
  if (numberTaken)
    return res.status(400).json({ error: 'Number already taken' });

  const createID = () => Math.floor(Math.random() * 1000000);
  const newContact = {
    name,
    number,
    id: createID(),
  };

  persons = persons.concat(newContact);

  res.send(newContact);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(cont => cont.id !== id);

  res.status(204).end();
});

app.get('/info', (req, res) => {
  const info = `The Phonebook has ${persons.length} contacts at ${new Date()}`;
  res.send(info);
});

// SERVER =======================================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);
