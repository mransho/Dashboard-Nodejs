var jwt = require("jsonwebtoken");
const authUser = require("../models/authUser")
require('dotenv').config();
const Customer = require("../models/customersSchema");
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (!token) return res.redirect("/Login");
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        
        next();
    } catch (err) {
        console.error("JWT Error:", err.message);
        return res.redirect("/Login");
    }
}
const chekIfUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

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

const checkIfAccess = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.redirect("/");
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).send("Customer not found");
        const hasAccess =
            customer.Creator.toString() === decoded.id ||
            customer.usersIds.map(id => id.toString()).includes(decoded.id);

        if (!hasAccess) {
            res.status(401).send("Unauthorized");
            return res.redirect("/");
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send("Unauthorized");
    }
};

module.exports = { requireAuth, chekIfUser, checkIfAccess }
