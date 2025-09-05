const mongoose = require('mongoose');
const Schema = mongoose.Schema



const articleSchema = new Schema({
    userNameee:String
})


// Create a model based on that schema
const MyData = mongoose.model("MyDataa", articleSchema);


module.exports = MyData;



























