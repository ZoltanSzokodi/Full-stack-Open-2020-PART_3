const mongoose = require('mongoose');

// Create the person schema
const personSchema = mongoose.Schema({
  name: String,
  number: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
