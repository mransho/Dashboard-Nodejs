const User = require('../models/customersSchema.js');
var moment = require('moment');

// ------------------------- GET Request---------------------------- //

let user_index_get = (req, res) => {
    User.find().then((result) => {
        res.render('index', { arr: result, moment: moment })
    }).catch((err) => {
        console.log(err)
    })
}

let user_add_get = (req, res) => {
    res.render('user/add', {})
}

let user_edit_get = (req, res) => {
    User.findById(req.params.id)
        .then((result) => {
            res.render('user/edit', { data: result, moment: moment })
        })
        .catch((err) => { console.log(err) })
}


let user_view_get = (req, res) => {
    User.findById(req.params.id)
        .then((result) => {
            res.render('user/view', { data: result, moment: moment })
        })
        .catch((err) => { console.log(err) })
}


// ------------------------- POST Request---------------------------- //
let user_add_POST = (req, res) => {
    User.create(req.body).then(() => {
        res.redirect('/user/add')
    }).catch((err) => {
        console(err)
    })
}

let user_search_POST = (req, res) => {
    let search = req.body.search.trim()
    User.find({
        $or: [
            { FirstName: { $regex: search, $options: "i" } },
            { LastName: { $regex: search, $options: "i" } },
            { Email: { $regex: search, $options: "i" } },
            { Telephone: { $regex: search, $options: "i" } },
        ]
    }).then((result) => {
        res.render('user/search', { result: result, moment: moment })

    }).catch((err) => {
        console.log(err)
    })
}

// ------------------------- delete Request---------------------------- //


let user_index_delete = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.redirect('/')
        })
        .catch((err) => { console.log(err) })
}

// ------------------------- PUT Request---------------------------- //

let user_edit_PUT = (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)
        .then((result) => {
            res.redirect(`/edit/${req.params.id}`)
        })
        .catch((err) => { console.log(err) })
}
// ------------------------------------------------------------------------- //

module.exports = {
    user_index_get,
    user_add_get,
    user_edit_get,
    user_view_get,
    user_add_POST,
    user_search_POST,
    user_index_delete,
    user_edit_PUT,
}