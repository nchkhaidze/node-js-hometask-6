const initialize = require("./passport-config");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:2717/users", { useNewUrlParser: true });
const UserSchema = new mongoose.Schema({ username: String, password: String, jwt: String }, { collection: "users" });
const User = mongoose.model("User", UserSchema, "users");

module.exports = {
    User,
}



