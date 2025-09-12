const authUser = require("../models/authUser")
const bcrypt = require('bcrypt');
var jwt = require("jsonwebtoken");


const { check, validationResult } = require("express-validator");
require('dotenv').config();

// ------------------------------------------------------------------------- //

let signOut_get = (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 1
    })
    res.redirect('/')
}



let Login_get = (req, res) => {
    res.render("auth/Login")
}

let Login_post = async (req, res) => {
    const loginUser = await authUser.findOne({ Email: req.body.Email })


    if (loginUser == null) {
        return res.json({ errEmail: "this user is not registered" })
    } else {
        const match = await bcrypt.compare(req.body.Password, loginUser.Password)
        if (match) {
            let token = jwt.sign({ id: loginUser._id }, process.env.JWT_SECRET_KEY);
            res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
            return res.json({ id: loginUser._id })
        } else {
            return res.json({ errPassword: "the Password is not correct" })
        }
    }
}

let SignUp_get = (req, res) => {
    res.render("auth/SignUp")
}

let SignUp_Post =
    async (req, res) => {
        try {
            // validation
            const objError = validationResult(req);
            if (objError.errors.length > 0) {
                return res.json({ validationErr: objError.errors })
            }

            // email is already used
            const isCurrentEmail = await authUser.findOne({ Email: req.body.Email })
            if (isCurrentEmail) {
                return res.json({ errEmail: "email is already used" })
            }

            // UserName is already used
            const isCurrentUserName = await authUser.findOne({ UserName: req.body.UserName })
            if (isCurrentUserName) {
                return res.json({ errUserName: "UserName is already used" })
            }

            // create user and login
            let newUser = await authUser.create(req.body)
            let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
            res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
            res.json({ id: newUser._id })

        } catch (error) {
            console.log(error)
        }
    }

// ------------------------------------------------------------------------- //

module.exports = {
    signOut_get,
    Login_get,
    Login_post,
    SignUp_get,
    SignUp_Post,
}