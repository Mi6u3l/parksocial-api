const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ParkingSpot = require('../models/parkingspot-model');

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

router.get('/parkingspots', (req, res, next) => {
  ParkingSpot.find((err, parkingspotsList) => {
    if (err) {
      res.json(err);
      console.log(err);
      return;
    }
    console.log(parkingspotsList);
    res.json(parkingspotsList);
  });
});


module.exports = router;