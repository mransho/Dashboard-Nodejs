const customer = require('../models/customersSchema.js');
var moment = require('moment');
const jwt = require("jsonwebtoken");
const User = require("../models/authUser.js");
require('dotenv').config();

const customerQuery = (id, userId) => ({
    _id: id,
    $or: [{ Creator: userId }, { usersIds: userId }]
});

// ------------------------- GET Request---------------------------- //
let customer_index_get = async (req, res) => {
    try {


        const customers = await customer.find({
            $or: [
                { Creator: req.user.id },
                { usersIds: req.user.id }
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

    const users = await User.find({}, "UserName _id");
    customer.findOne(
        customerQuery(req.params.id, req.user.id)
    )
        .then((result) => {
            res.render('user/edit', { data: result, moment: moment, users: users })
        })
        .catch((err) => { console.log(err) })
}
let customer_view_get = (req, res) => {
    customer.findOne(customerQuery(req.params.id, req.user.id))
        .then((result) => {
            res.render('user/view', { data: result, moment: moment })
        })
        .catch((err) => { console.log(err) })
}


// ------------------------- POST Request---------------------------- //
let customer_add_POST = async (req, res) => {
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
            Creator: req.user.id
        });
        res.redirect('/user/add');
    } catch (err) {
        console.log(err);
    }
};


let customer_search_POST = async (req, res) => {
    try {
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
                        { Creator: req.user.id },
                        { usersIds: req.user.id }
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

    customer.findOneAndDelete(customerQuery(req.params.id, req.user.id))
        .then((result) => {
            res.redirect('/')
        })
        .catch((err) => { console.log(err) })
}

// ------------------------- PUT Request---------------------------- //

let customer_edit_PUT = (req, res) => {
    let body = req.body;
    body.usersIds = JSON.parse(body.usersIds || "[]");
    customer.findOneAndUpdate(customerQuery(req.params.id, req.user.id), body)
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