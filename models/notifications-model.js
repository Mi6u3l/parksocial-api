'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notification = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'The address is required']
  },
  userid: { 
    type: Schema.Types.ObjectId, ref: 'User',
    required: [true, 'The user id is required']
  }
 },
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Notification = mongoose.model('Notification', notification);

module.exports = Notification;