'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parkingSpot = new mongoose.Schema({
  latitude: {
    type: String,
    required: [true, 'The latitude is required']
  },
  longitude: {
    type: String,
    required: [true, 'The longitude is required']
  },
  address: {
    type: String,
    required: [true, 'The address is required']
  },
  valid: {
    type: Boolean,
    required: [false, 'The address is required']
  },
  userreportedid: { 
    type: Schema.Types.ObjectId, ref: 'User',
    required: [true, 'The user id is required']
  },
  userunreportedid: { 
     type: Schema.Types.ObjectId, ref: 'User',
      required: [false, 'The user id is required']
  },
 },
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const ParkingSpot = mongoose.model('ParkingSpot', parkingSpot);

module.exports = ParkingSpot;