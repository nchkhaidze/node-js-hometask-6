const LocalStrategy = require("passport-local").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const jwt = require("jsonwebtoken");
const secret = "TheOwlsAreNotWhatTheySeem";

const db = require("./db");
const User = db.User;

const { authenticateUser, validateJWT } = require("./strategies");

const serializeHandler = async (user, done) => {
    const token = jwt.sign(
        { username: user.username },
        secret,
        { expiresIn: "24h" }
    );
    console.log(`${user.username} is assigned a token ${token}`);
    await User.updateOne(
        { username: user.username },
        { jwt: token },
        (err, updatedUser) => {
            done(null, updatedUser)
        }
    );
};

const deserializeHandler = (user, done) => {
    done(null, user);
};

function initialize(passport) {
    const bearerStrategy = new BearerStrategy(validateJWT);
    const localStrategy = new LocalStrategy(
        { usernameField: "username", passwordField: "password" },
        authenticateUser
    );

    passport.use("local", localStrategy);
    passport.use("bearer", bearerStrategy);

    passport.serializeUser(serializeHandler);
    passport.deserializeUser(deserializeHandler);
}

module.exports = {
    initialize,
    serializeHandler,
    deserializeHandler,
};