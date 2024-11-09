const User = require('../models/user');
module.exports = async (req, res) => {
    let user = req.user;
    // make username have a capital first letter
    user.username = user.username.charAt(0).toUpperCase() + user.username.slice(1);
    let data = ''
    // get every user in the database
    try {
        data = await User.find({});
        res.render("admin", {user: user, users: data, message: ''});
    } catch (err) {
        console.log(err);
    }
   
}
    