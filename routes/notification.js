const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');

const Notification = require('../models/notifications-model');
const ParkingSpot = require('../models/parkingspot-model');
const User = require('../models/user-model');

router.post('/notifications', (req, res, next) => {

  const notification = new Notification({
    address: req.body.address,
    userid: req.body.userid
  });

  notification.save((err) => {
    if (err) {
      console.log('error', err);
      res.json(err);
      return;
    }

    res.json({
      message: 'New Notification created'
    });
  });
});

router.delete('/notifications/:userid', (req, res, next) => {
  Notification.remove({ userid: req.params.userid }, (err) => {
    if (err) {
      console.log('error', err);
      res.json(err);
      return;
    }

    res.json({
      message: 'notification deleted'
    });
  });
});

router.get('/notifications/:userid', (req, res, next) => {
  Notification.find({userid : req.params.userid }, null, (err, notification) => {
    if (err) {
      res.json(err);
      console.log(err);
      return;
    }
      res.json(notification);
  });
});


module.exports = router;