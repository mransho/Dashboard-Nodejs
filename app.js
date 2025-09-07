const express = require('express')
const app = express()
const mongoose = require('mongoose');
const port = process.env.PORT || 3001;

app.use(express.static('public'))

var methodOverride = require('method-override')
app.use(methodOverride('_method'))


app.use(express.urlencoded({ extended: true })); 
app.use(express.json());


const routers = require('./api/router')
app.use(routers)

// ------------------------- Auto refresh ---------------------------- //
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 1);
});


// ------------------------- ejs ---------------------------- //
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

// --------------------------------------------------------- //

mongoose.connect('mongodb+srv://dash_node:HrMgqCO4HXd0YUEh@cluster0.vidmubj.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    app.listen(port, () => {
        console.log(`http://localhost:${port}/`)
    })
}).catch((err) => {
    console.log(err)
});

app.post('/', (req, res) => {
    const myData = new MyData(req.body);
    myData.save().then(() => {
        console.log(req.body)
        res.redirect('/')
    }).catch((err) => {
        console.log(err)
    })
})



















