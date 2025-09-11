const express = require('express')
const router = express.Router()
const Controllers = require('../Controllers/Controller')
const authUser = require("../models/authUser")
const bcrypt = require('bcrypt');
let { requireAuth } = require('../middlewares/middleware');
let { chekIfUser } = require('../middlewares/middleware');

var jwt = require("jsonwebtoken");
router.use(chekIfUser);

// ------------------------- AuthUser Request---------------------------- //

router.get('/signOut', (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 1
    })
    res.redirect('/')
})

router.get('/', (req, res) => {
    res.render("welcome")
})


router.get('/Login', (req, res) => {
    res.render("auth/Login")
})

router.post('/Login', async (req, res) => {
    let logInUser = await authUser.findOne({ Email: req.body.Email })

    if (logInUser == null) {
        console.log('this user is not registered')
    } else {
        const match = await bcrypt.compare(req.body.Password, logInUser.Password)
        if (match) {
            let token = jwt.sign({ id: logInUser._id }, "test");
            res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
            res.redirect("/home")
        }
    }

})


router.get('/SignUp', (req, res) => {
    res.render("auth/SignUp")
})
router.post('/SignUp', async (req, res) => {
    try {
        let tesult = await authUser.create(req.body)
        console.log(tesult)
        res.render("auth/SignUp")
    } catch (error) {
        console.log(error)
    }
})
// ------------------------- GET Request---------------------------- //
router.get('/home', requireAuth, Controllers.user_index_get)
router.get('/user/add', requireAuth, Controllers.user_add_get)
router.get('/edit/:id', requireAuth, Controllers.user_edit_get)
router.get('/view/:id', requireAuth, Controllers.user_view_get)
// ------------------------- POST Request---------------------------- //
router.post('/user/add', Controllers.user_add_POST)
router.post('/search', Controllers.user_search_POST)
// ------------------------- delete Request---------------------------- //
router.delete('/edit/:id', Controllers.user_index_delete)
// ------------------------- PUT Request---------------------------- //
router.put('/edit/:id', Controllers.user_edit_PUT)
module.exports = router
