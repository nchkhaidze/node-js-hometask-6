const db = require("./db");
const User = db.User;

const authenticateUser = async (username, password, done) => {
    const users = await User.find({ username });
    if (!users || !users.length) {
        done("User not found");
    }
    else if (users[0].password === password) {
        console.log(`user ${users[0].username} logged in`);
        done(null, users[0]);
    } else {
        done("Invalid password");
    }
}

const validateJWT = async (token, done) => {
    const users = await User.find({ jwt: token });
    if (!users || !users.length) {
        done("Invalid JWT");
    } else {
        done(null, users[0]);
    }
}

module.exports = {
    authenticateUser,
    validateJWT,
}


