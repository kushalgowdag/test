import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: [true, "Please enter Username!"]
    },
    email:{
        type: String,
        required: [true, "Please enter Email!"]
    },
    password:{
        type: String,
        select: false,
        minlength: [5, "Minimum of 5 Character is required for Password!"],
        required: [true, "Please enter Password!"]
    },
    avatar:{
        public_id: String,
        url: String
    },
    phoneNumber:{
        type: Number,
        required: [true, "Please enter Phone Number!"]
    },
    sex:{
        type: String,
        required: [true, "Please select ur Sex!"]
    },
    dob:{
        type: Date,
        // required: [true, "Please fill your Date of Birth!"]
    },
    role:{
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true})

UserSchema.pre("save",async function(next) {
    if(this.isModified("password")){
        const genSalt = await bcrypt.genSalt(12)
        this.password = await bcrypt.hash(this.password, genSalt)
    }
    next()
})

UserSchema.methods.comparePassword = async function(pass){
    return await bcrypt.compare(pass, this.password)
}

UserSchema.methods.token = async function(){
   return await jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})
}

const UserModel = mongoose.model("User", UserSchema)

export default UserModel