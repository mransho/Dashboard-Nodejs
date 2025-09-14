const mongoose = require('mongoose');
const Schema = mongoose.Schema
const AuthUserSchema = new Schema({
    UserName: String,
    Email: String,
    Password: String,
    validCustomers_Ids: [
        { id: String }
    ],
    mineCustomers_Ids: [
        { id: String }
    ],

}, { timestamps: true })

// =================================== Hash Password =====================================
const bcrypt = require('bcrypt');
AuthUserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
});


const AuthUser = mongoose.model("User", AuthUserSchema);
module.exports = AuthUser;
