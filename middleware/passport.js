const passport = require('passport');
const {Strategy} = require('passport-local');
const {User} = require('../models');
const md5 = require('md5');

async function authenticate (username, password, done) {
    const user = await User.findOne({
        where: {
            email: username
        }
    });
    if(!user || md5(password) !== user.password) {
        return done(null, false, {message: 'Incorrect email or password.'});
    }
    return done(null, {
        id: user.id,
        email: user.email,
        displayName: user.ufirstname,
        officer: user.officer,
        admin: user.admin,
        student: user.student
    });
}

const validationStrategy = new Strategy({
        usernameField: 'email',
        passwordField: 'password',
    },
    authenticate);

passport.use(validationStrategy);

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        passport.serializeUser(function(user, cb) {
            process.nextTick(function() {
                cb(null, user);
            });
        });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, user);
    });
});

module.exports.passport = passport;