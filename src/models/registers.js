const mongoose = require("mongoose");
const regSchema = new mongoose.Schema({
    userid : {
        type:String,
        require:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword: {
        type:String,
        required:true
    }
})

// collection
 const Register = new mongoose.model("Register",regSchema)

 module.exports = Register;