const mongoose = require("mongoose");
const brypt = require("bcryptjs");

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

//hashing
regSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await brypt.hash(this.password, 10);
        this.confirmpassword = undefined;
        console.log(this.password)
    }
    next();
})

// collection
 const Register = new mongoose.model("Register",regSchema)

 module.exports = Register;