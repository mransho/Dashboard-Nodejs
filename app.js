const express = require('express')
const app = express()
//------------------------- cookie-parser ------------------------- //
var cookieParser = require('cookie-parser')
app.use(cookieParser())

const mongoose = require('mongoose');
require('dotenv').config();
const port = process.env.PORT || 3001;
const connectLivereload = require("connect-livereload");
app.use(connectLivereload());
app.use(express.static('public'))
var methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const routers = require('./routes/router')
app.use(routers)



// ------------------------- Auto refresh ------------------------- //
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
liveReloadServer.watch(path.join(__dirname, 'views'));
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});
// ------------------------- ejs ---------------------------- //
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
// --------------------------------------------------------- //
mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(port, () => {
        console.log(`http://localhost:${port}/`)
    })
}).catch((err) => {
    console.log(err)
});

// const User = require('./models/customersSchema');
// app.post('/', (req, res) => {
//     const myData = new User(req.body);
//     myData.save().then(() => {
//         console.log(req.body)
//         res.redirect('/home')
//     }).catch((err) => {
//         console.log(err)
//     })
// })

