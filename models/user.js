const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    _id: String,
    admin: Boolean,
    domains: Array,
    username: String,
    email: String,
    avatar_url: String,
});

module.exports = mongoose.model("users", schema, "users");