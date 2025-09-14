const express = require('express')
const router = express.Router()
const Controllers = require('../Controllers/Controller')
const authController = require('../Controllers/authController')
let { requireAuth } = require('../middlewares/middleware');
let { chekIfUser, checkIfAccess } = require('../middlewares/middleware');

router.use(chekIfUser);
const { check, validationResult } = require("express-validator");



// ------------------------- AuthUser Request---------------------------- //

router.get('/signOut', authController.signOut_get)

router.get('/Login', authController.Login_get)

router.post('/Login', authController.Login_post)

router.get('/SignUp', authController.SignUp_get)

router.post('/SignUp',
    [
        check("Email", "Please provide a valid email").isEmail(),
        check("Password", "Password must be at least 8 characters with 1 upper case letter and 1 number").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
    ],
    authController.SignUp_Post
)



router.get('/', (req, res) => {
    res.render("welcome")
})
// ------------------------- GET Request---------------------------- //
router.get('/home', requireAuth, Controllers.customer_index_get)
router.get('/user/add', requireAuth, Controllers.customer_add_get)
router.get('/edit/:id', requireAuth, checkIfAccess, Controllers.customer_edit_get)
router.get('/view/:id', requireAuth, checkIfAccess, Controllers.customer_view_get)
// ------------------------- POST Request---------------------------- //
router.post('/user/add', Controllers.customer_add_POST)

router.post('/search', requireAuth, Controllers.customer_search_POST)
// ------------------------- delete Request---------------------------- //
router.delete('/edit/:id', requireAuth, checkIfAccess, Controllers.customer_index_delete)
// ------------------------- PUT Request---------------------------- //
router.put('/edit/:id', requireAuth, checkIfAccess, Controllers.customer_edit_PUT)
module.exports = router
