const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');

const User = require('./models/customersSchema.js');
app.use(express.static('public'))



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


// ------------------------- GET Request---------------------------- //

app.get('/', (req, res) => {
    User.find().then((result) => {
        res.render('index', { arr: result })
    }).catch((err) => {
        console.log(err)
    })
})

app.get('/user/add', (req, res) => {
    res.render('user/add', {})
})

app.get('/user/:id', (req, res) => {
    User.findById(req.params.id)
        .then((result) => {
            res.render('user/view', { data: result })
        })
        .catch((err) => { console.log(err) })
})

app.get('/user/edit', (req, res) => {
    res.render('user/edit', {})
})

// ------------------------- POST Request---------------------------- //

app.post('/user/add', async (req, res) => {
    console.log(req.body)
    const user = new User(req.body)
    user.save().then(() => {
        res.redirect('/user/add')
    }).catch((err) => {
        console(err)
    })
})



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



















