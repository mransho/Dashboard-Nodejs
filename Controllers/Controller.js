const customer = require('../models/customersSchema.js');
var moment = require('moment');


const jwt = require("jsonwebtoken");
const User = require("../models/authUser.js");
require('dotenv').config();
// ------------------------- GET Request---------------------------- //

let customer_index_get = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const customers = await customer.find({
            $or: [
                { Creator: decoded.id },
                { usersIds: decoded.id }
            ]
        })
            .populate("Creator", "UserName")
            .populate("usersIds", "UserName");
        res.render("index", { arr: customers, moment: moment });
    } catch (err) {
        console.log(err);
    }
}

let customer_add_get = (req, res) => {
    res.render('user/add', {})
}

let customer_edit_get = async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const users = await User.find({}, "UserName _id");
    customer.findOne({
        _id: req.params.id,
        $or: [
            { Creator: decoded.id },
            { usersIds: decoded.id }
        ]
    })
        .then((result) => {
            res.render('user/edit', { data: result, moment: moment, users: users })
        })
        .catch((err) => { console.log(err) })
}


let customer_view_get = (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    customer.findOne({
        _id: req.params.id,
        $or: [
            { Creator: decoded.id },
            { usersIds: decoded.id }
        ]
    })
        .then((result) => {
            res.render('user/view', { data: result, moment: moment })
        })
        .catch((err) => { console.log(err) })
}


// ------------------------- POST Request---------------------------- //
let customer_add_POST = async (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    try {
        let usersIds = [];
        if (req.body.usersIds) {
            try {
                usersIds = JSON.parse(req.body.usersIds);
            } catch (err) {
                console.log("Invalid usersIds JSON:", req.body.usersIds);
                usersIds = [];
            }
        }
        await customer.create({
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Email: req.body.Email,
            Telephone: req.body.Telephone,
            Age: req.body.Age,
            Country: req.body.Country || "",
            Gender: req.body.Gender || "",
            usersIds: usersIds,
            Creator: decoded.id
        });
        res.redirect('/user/add');
    } catch (err) {
        console.log(err);
    }
};

// let customer_search_POST = (req, res) => {
//     const token = req.cookies.jwt;
//     if (!token) return res.redirect("/login");
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     let search = req.body.search.trim()
//     customer.find({
//         $or: [
//             { FirstName: { $regex: search, $options: "i" } },
//             { LastName: { $regex: search, $options: "i" } },
//             { Email: { $regex: search, $options: "i" } },
//             { Telephone: { $regex: search, $options: "i" } },
//         ]
//     }).then((result) => {

//         res.render('user/search', { result: result, moment: moment })
//     }).catch((err) => {
//         console.log(err)
//     })
// }

let customer_search_POST = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.redirect("/login");
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const search = req.body.search.trim();

        const result = await customer.find({
            $and: [
                {
                    $or: [
                        { FirstName: { $regex: search, $options: "i" } },
                        { LastName: { $regex: search, $options: "i" } },
                        { Email: { $regex: search, $options: "i" } },
                        { Telephone: { $regex: search, $options: "i" } },
                    ]
                },
                {
                    $or: [
                        { Creator: decoded.id },
                        { usersIds: decoded.id }
                    ]
                }
            ]
        })
            .populate("Creator", "UserName")
            .populate("usersIds", "UserName");

        res.render("user/search", { result, moment });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};

// ------------------------- delete Request---------------------------- //


let customer_index_delete = (req, res) => {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    customer.findOneAndDelete({
        _id: req.params.id,
        $or: [
            { Creator: decoded.id },
            { usersIds: decoded.id }
        ]
    })
        .then((result) => {
            res.redirect('/')
        })
        .catch((err) => { console.log(err) })
}

// ------------------------- PUT Request---------------------------- //

let customer_edit_PUT = (req, res) => {
    let body = req.body;
    body.usersIds = JSON.parse(body.usersIds || "[]");

    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    customer.findOneAndUpdate(
        {
            _id: req.params.id,
            $or: [
                { Creator: decoded.id },
                { usersIds: decoded.id }
            ]
        }
        , body)
        .then((result) => {
            res.redirect(`/home`)
        })
        .catch((err) => { console.log(err) })
}
// ------------------------------------------------------------------------- //

module.exports = {
    customer_index_get,
    customer_add_get,
    customer_edit_get,
    customer_view_get,
    customer_add_POST,
    customer_search_POST,
    customer_index_delete,
    customer_edit_PUT,
}