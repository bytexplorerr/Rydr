const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({

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
        minlength:[5,'Email should be at least 5 characters long']
    },
    password:{
        type:String,
        required:true,
        minlength:[6,'Password should be at least 6 characters long'],
        select:false
    },
    verificationToken:{
        type:String
    },
    socketId:{
        type:String,
    },

    // status of captain
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },

    // vehicle
    vehicle:{
        color:{
            type:String,
            required:true,
            minlength:[3,'Color name should be at least 3 characters long']
        },
        plate:{
            type:String,
            required:true,
            minlength:[3,'Plat Number should be at least 3 characters long']
        },
        capacity:{
            type:Number,
            required:true,
            min:[1,'Capacity of vehicle must be at least 1']
        },
        vehicleType:{
            type:String,
            required:true,
            enum:['auto','car','motorcycle']
        }
    },

    // location
    location:{
        ltd:{
            type:Number,
            //required:true,
        },
        lng:{
            type:Number,
            //required:true,
        }
    },
    expiresAt: { type: Date, 
        default: () => new Date(Date.now() + 10 * 60 * 1000),
        index: { expires: 600 } } // Token expires in 10 minutes (600 seconds)
});

captainSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
}

captainSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

captainSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,10);
}

captainSchema.statics.generateChangePasswordToken = function(userId) {
    const token = jwt.sign({_id:userId},process.env.JWT_SECRET,{expiresIn:'10m'})
    return token;
}

// Ensure TTL index is created
captainSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 600 });


const captainModel = mongoose.models.captains || mongoose.model('captains',captainSchema);

module.exports = captainModel;