'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'The first name is required']
  },
  lastname: {
    type: String,
    required: [true, 'The last name is required']
  },
  email: {
    type: String,
    required: [true, 'The email is required']
  },
  username: {
    type: String,
    required: [true, 'The username is required']
  },
  password: {
    type: String,
    required: [true, 'The password is required']
  },
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;