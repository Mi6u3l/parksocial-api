const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const ParkingSpot = require('../models/parkingspot-model');
const Notification = require('../models/notifications-model');
const User = require('../models/user-model');
const helper = require('sendgrid').mail;
const Notify = require('../config/parksocial-sendgrid');
const socketIO = require('socket.io');

//testing socket.io
const socketServer = express()
  .use((req, res) => res.sendStatus(200))
  .listen(8080, () => console.log(`Listening on ${ 8080 }`));

const io = socketIO(socketServer);
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});


//Create new parking spot
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

    //broadcast new parking spot
    io.emit('newspot', 'new spot created');

    //check for notifications
    Notification.find({}, null, (err, notifications) => {
      if (err) {
        res.json(err);
        console.log(err);
        return;
      }
      notifications.forEach((notification) => {
        let street = spot.address.substring(0, spot.address.indexOf(","));
        let notificationStreet = notification.address.substring(0, notification.address.indexOf(","));
        if (street.indexOf(notificationStreet) != -1) {
          //get notification's user email
          User.findById(notification.userid, null, (err, user) => {
            if (err) {
              res.json(err);
              return;
            }
            console.log(user.email);
            var sendNotification = require('gmail-send')({
              user: 'ironparksocial@gmail.com',
              pass: 'aFa01JKV!',
              to:   user.email,
              subject: 'Park Social Notifications',
              text:    `There is new parking spot at ${notification.address} waiting for you!`,
            });
            sendNotification();
          });

        }
      });
    });

  });
});

//update parking spot
router.put('/parkingspots/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({
      message: 'Specified id is not valid'
    });
    return;
  }

  let userid = req.body._id;
  if (req.body.valid === false) {
     userid = null;
  }
 
  const updates = {
    userunreportedid: userid,
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

  //broadcast update
  io.emit('newspot', 'spot updated');
});

//update parking spot
router.put('/parkingspot/:parkingspotid', (req, res, next) => {
  const updates = {
    userunreportedid: null,
    userreportedid: req.body._id
  };

  ParkingSpot.findByIdAndUpdate({
    _id: req.params.parkingspotid
  }, updates, (err, parkingSpot) => {
    if (err) {
      res.json(err);
      console.log('problem', err);
      return;
    }
    res.json(parkingSpot);
  });
  //broadcast update
  io.emit('newspot', 'spot updated');
});

router.get('/parkingspot/:userid', (req, res, next) => {
  ParkingSpot.find({
    userunreportedid: req.params.userid
  }, null, (err, parkingSpot) => {
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
  ParkingSpot.find({
    $and: [
    { userunreportedid: { $eq: null, } },
    { valid: { $ne: false, } }
    ]}, null, {
    sort: {
      created_at: -1
    }
  }, (err, parkingspotsList) => {
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