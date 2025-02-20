const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            required:true,
            minlength:[3,'First Name should be at least 3 characters long']
        },
        lastName:{
            type:String,
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minLength:[5,'Email should be at least 5 characters long']
    },
    password:{
        type:String,
        required:function(){
            return !this.googleId;
        },
        select:false, // when finding user this field will not transfer.
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true // Allow multiple user without googleId
    },
    verificationToken:{
        type:String,
    },
    socketId:{ // socketId is required for tracking live location of driver and passanger
        type:String 
    },
    expiresAt: { type: Date, 
        default: () => new Date(Date.now() + 10 * 60 * 1000),
        index: { expires: 600 } }, // Token expires in 10 minutes (600 seconds)
});


userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'})
    return token;
}

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password,this.password);
}

userSchema.statics.hashPassword = async function (passWord) {
    return await bcrypt.hash(passWord,10);
}

userSchema.statics.generateChangePasswordToken = function(userId) {
    const token = jwt.sign({_id:userId},process.env.JWT_SECRET,{expiresIn:'10m'})
    return token;
}

// Ensure TTL index is created
userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 600 });


const userModel = mongoose.models.user || mongoose.model('user',userSchema);
// if model is not created then create it otherwise use that model.

module.exports = userModel;