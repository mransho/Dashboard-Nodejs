const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');

const MyData = require('./models/myDataSchema');

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    // res.sendFile('./views/home.html', { root: __dirname })
    MyData.find().then((result) => {
        console.log(result)
        console.log("result")
    }).catch(() => {

    })
    res.render('home', { myTitle: "Home Page" })
})

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



















