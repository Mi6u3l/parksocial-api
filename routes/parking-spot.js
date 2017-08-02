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

router.get('/parkingspots', (req, res, next) => {
  let parkingSpotsUsersList = [];
  ParkingSpot.find({}, null, {sort: {created_at: -1}}, (err, docs) => {
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
      console.log(parkingSpotsUsersList);
      res.json(parkingSpotsUsersList);
    });
  });
});

module.exports = router;