const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    FirstName: String,
    LastName: String,
    Email: String,
    Telephone: String,
    Age: Number,
    Country: String,
    Gender: String,
},
    { timestamps: true }
)


// Create a model based on that schema
const User = mongoose.model("customer", userSchema);


module.exports = User;



























