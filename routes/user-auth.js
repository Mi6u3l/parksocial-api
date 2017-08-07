const express = require('express');
const router = express.Router();
const fs = require('fs');

const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const jwtOptions = require('../config/jwt');

const User = require('../models/user-model');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.post('/signup', (req, res, next) => {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let picture = req.body.picture;
  let facebook = req.body.facebook;
  
  if (!username || (!facebook && !password)) {
    res.status(400).json({
      message: 'Provide username and password'
    });
    return;
  }

  User.findOne({
    username
  }, (err, foundUser) => {
    if (foundUser && !facebook) {
      res.status(400).json({
        message: 'The username already exists'
      });
      return;
    } else if (foundUser && facebook) {
       const payload = {
          id: foundUser._id,
          user: foundUser.username
        };
        const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.status(200).json({
          token,
          foundUser
        });
        return;
    }

    const theUser = new User({
      firstname,
      lastname,
      email,
      username,
      picture,
      facebook
    });

    let salt = bcrypt.genSaltSync(bcryptSalt);
    let hashPass;
    if (password !== undefined) {
      hashPass = bcrypt.hashSync(password, salt);
      theUser.password = hashPass;
    }

    console.log(theUser);
    theUser.save((err, user) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          message: err
        });
      } else {
        const payload = {
          id: user._id,
          user: user.username
        };
        const token = jwt.sign(payload, jwtOptions.secretOrKey);

        res.status(200).json({
          token,
          user
        });
      }
    });
  });
});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let facebook = req.body.facebook;

   if (facebook) {
      User.findOne({'username': username}, (err, user) => {
      const payload = {
          id: user._id,
          user: user.username,
      };
      const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.status(200).json({
          token,
          user
        });
      });
    return;
  }

  if (!username || !password) {
    res.status(401).json({
      message: 'Provide username and password'
    });
    return;
  }

  User.findOne({
    'username': username
  }, (err, user) => {
    if (!user) {
      res.status(401).json({
        message: 'The username or password is incorrect'
      });
      return;
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) {
        res.status(401).json({
          message: 'The username or password is incorrect'
        });
      } else {
        const payload = {
          id: user._id,
          user: user.username,
        };
        const token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.status(200).json({
          token,
          user
        });
      }
    });
  });
});

router.get('/ping', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  res.json('Pong');
});



module.exports = router;