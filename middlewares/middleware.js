var jwt = require("jsonwebtoken");
const authUser = require("../models/authUser")

const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, "test", (err) => {
            if (err) {
                res.redirect("Login")
            } else {
                next()
            }
        });
    } else {
        res.redirect("Login")
    }
}

const chekIfUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, "test"); // sync

            const logInUser = await authUser.findById(decoded.id);
            res.locals.user = logInUser;
            next();
        } catch (err) {
            res.locals.user = null;
            next();
        }
    } else {
        res.locals.user = null;
        next();
    }
};


module.exports = { requireAuth, chekIfUser }
