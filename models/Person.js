const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

// Create the person schema
const personSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    unique: true,
  },
  number: {
    type: String,
    required: true,
    minlength: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose unique validator
personSchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique.',
});

// Change the 'toJSON' method to re-name the and stringify the 'id' field
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
