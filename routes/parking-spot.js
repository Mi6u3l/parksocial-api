const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require("axios");

const ParkingSpot = require('../models/parkingspot-model');
const User = require('../models/user-model');

router.post('/parkingspots', (req, res, next) => {
  console.log('entered');
  const spot = new ParkingSpot({
    latitude: req.body.lat,
    longitude: req.body.lng,
    address: req.body.address,
    userreportedid: req.body.userid
  });

  spot.save((err) => {
    if (err) {
      console.log('error', err);
      res.json(err);
      return;
    }

    res.json({
      message: 'New Parking Spot created',
      id: spot._id
    });
  });
});


router.put('/parkingspots/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  const updates = {
    userunreportedid: req.body._id,
    valid: req.body.valid

  };
  console.log(req.body);
  ParkingSpot.findByIdAndUpdate(req.params.id, updates, (err) => {
    if (err) {
      res.json(err);
      return;
    }

    res.json({
      message: 'Parking spot updated successfully'
    });
  });
});

router.put('/parkingspot/:parkingspotid', (req, res, next) => {
  console.log('freeing')
  const updates = {
    userunreportedid: null,
    userreportedid: req.body._id
  };

  ParkingSpot.findByIdAndUpdate({ _id : req.params.parkingspotid }, updates, (err, parkingSpot) => {
    if (err) {
      res.json(err);
      console.log('problem',err);
      return;
    }
      res.json(parkingSpot);
  });
});

router.get('/parkingspot/:userid', (req, res, next) => {
  ParkingSpot.find({userunreportedid : req.params.userid }, null, (err, parkingSpot) => {
    if (err) {
      res.json(err);
      console.log(err);
      return;
    }
      res.json(parkingSpot);
  });
});

router.get('/parkingspots', (req, res, next) => {
  let parkingSpotsUsersList = [];
  ParkingSpot.find({ userunreportedid: { $eq: null }}, null, {sort: {created_at: -1}}, (err, parkingspotsList) => {
    if (err) {
      res.json(err);
      console.log(err);
      return;
    }
    let promises = [];
    parkingspotsList.forEach((parkingSpot) => {
      promises.push(
        User.findById(parkingSpot.userreportedid, (err, user) => {   
          let parkingSpotsUsers = {};
          parkingSpotsUsers.user = user;
          parkingSpotsUsers.parkingSpot = parkingSpot; 
          parkingSpotsUsersList.push(parkingSpotsUsers);
        })
        );
    });

    axios.all(promises).then(() => {
      res.json(parkingSpotsUsersList);
    });
  });
});

module.exports = router;