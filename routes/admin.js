const User = require('../models/user');
module.exports = async (req, res) => {
    const user = req.user;
    let data = ''
    // get every user in the database
    try {
        data = await User.find({});
        res.render("admin", {user: user, users: data, message: ''});
    } catch (err) {
        console.log(err);
    }
   
}
    