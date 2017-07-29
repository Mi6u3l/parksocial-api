const passportJwt = require('passport-jwt');
const ExtractJwt  = passportJwt.ExtractJwt;

let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'p@rks0cial';

module.exports = jwtOptions;