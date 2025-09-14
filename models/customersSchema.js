const mongoose = require('mongoose');
const Schema = mongoose.Schema

const CustomersSchema = new Schema({
    FirstName: String,
    LastName: String,
    Email: String,
    Telephone: String,
    Age: Number,
    Country: String,
    Gender: String,
    createdAt: Date,
    updatedAt: Date,
    Creator: { type: Schema.Types.ObjectId, ref: "User" },
    usersIds: [{ type: Schema.Types.ObjectId, ref: "User" }]
},
    { timestamps: true }
)



// Create a model based on that schema
const User = mongoose.model("customer", CustomersSchema);


module.exports = User;



























