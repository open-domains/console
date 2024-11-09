module.exports = async (req, res) => {
    let user = req.user;
    user.username = user.username.charAt(0).toUpperCase() + user.username.slice(1);
    const code = req.query.code;
    const data = ''
    token = '222'


    if (code){
        if (code == 1){
            return res.render("domain", {user: user, jwt: token, domains: data, message: "System error, please try again later"});
        }
        if (code == 2){
            return res.render("domain", {user: user, jwt: token, domains: data, message: "Domain not found"});
        }
        if (code == 3){
            return res.render("domain", {user: user, jwt: token, domains: data, message: "Domain already exists"});
        }
        if (code == 4){
            return res.render("domain", {user: user, jwt: token, domains: data, message: "You do not have permission to edit this domain"});
        }
        if (code == 5){
            return res.render("domain", {user: user, jwt: token, domains: data, message: "You do not have permission to access this page"});
        } else {
            return res.render("domain", {user: user, jwt: token, domains: data, message: ""});
        }
    } else {
        return res.render("domain", {user: user, domains: data, message: ""});
    }


}
    