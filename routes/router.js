const express = require('express')

const router = express.Router()
const Controllers = require('../Controllers/Controller')

router.get('/welcome', (req, res) => {
    res.render("welcome")
})


// ------------------------- GET Request---------------------------- //

router.get('/home', Controllers.user_index_get)

router.get('/user/add', Controllers.user_add_get)

router.get('/edit/:id', Controllers.user_edit_get)

router.get('/view/:id', Controllers.user_view_get)

// ------------------------- POST Request---------------------------- //

router.post('/user/add', Controllers.user_add_POST)

router.post('/search', Controllers.user_search_POST)


// ------------------------- delete Request---------------------------- //

router.delete('/edit/:id', Controllers.user_index_delete)

// ------------------------- PUT Request---------------------------- //

router.put('/edit/:id', Controllers.user_edit_PUT)

module.exports = router
