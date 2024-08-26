const moongose = require("mongoose");

const userSchema = new moongose.Schema({
    email:{
        "type": String,
        "required": true,
        "unique": true
    },
    password:{
        "type": String,
        "required": true
    },
    name:{
        "type": String,
        "required": true
    },
    lastLogin:{
        "type": Date,
        default: Date.now
    },
    isVerified:{
        "type": Boolean,
        default: false
    },
    resetPasswordToken:{
        "type": String,
        default: null
    },
    resetPasswordExpireAt:{
        "type": Date,
        default: null
    },
    verificationToken:{
        "type": String,
        default: null
    },
    verificationTokenExpireAt:{
        "type": Date,
        default: null
    }
}, {timestamps: true});

const User = moongose.model("User", userSchema);

module.exports = User