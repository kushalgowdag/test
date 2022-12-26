import UserModel from "../Models/UserModel.js"
import cloudinary from "cloudinary"
import fs from "fs"

export const RegisterUser = async(req, res) => {
    try {
        const { email, password, username, phoneNumber, sex, dob } = req.body 

        const { avatar } = req.files

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please fill All the details!"
            })
        }

        let user = await UserModel.findOne({email})

        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exists!"
            })
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatar.tempFilePath, {
            folder: "images"
        })

        fs.rmSync("./tmp", {
            recursive: true
        })

        user = await UserModel.create({
            email, password, username, phoneNumber, sex, dob, avatar:{
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        })

        const token = await user.token()

        const options = { expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), httpOnly: true }

        res.status(200).cookie("token", token, options).json({
            success: true,
            message: "User created Successfully!",
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const LoginUser = async(req, res) => {
    try {
        const { email, password } = req.body 

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please fill email and password!"
            })
        }

        const user = await UserModel.findOne({email}).select("+password")

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid email and password!"
            })
        }

        const pass = await user.comparePassword(password)

        if(!pass){
            return res.status(400).json({
                success: false,
                message: "Invalid email and password!"
            })
        }

        const token = await user.token()

        const options = { expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), httpOnly: true }

        res.status(200).cookie("token", token, options).json({
            success: true,
            message: "User logged in Successfully!",
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const Logout = async(req, res) => {
    try {
        const options = { expires: new Date(Date.now()), httpOnly: true}

        res.status(200).cookie("token", null, options).json({
            success: true,
            message: "User logged out Successfully!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const UserProfile = async(req, res) => {
    try {
        const user = await UserModel.findById(req.user.id) 

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Please Login!"
            })
        }
        
        res.status(200).json({
            success: true,
            message: "User details found Successfully!",
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const EditProfile = async(req, res) => {
    try {
        const user = await UserModel.findById(req.user.id) 

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Please Login!"
            })
        }

        const { email, username, phoneNumber, sex} = req.body

        if(email){
            user.email = email
            await user.save()
        }

        if(username){
            user.username = username
            await user.save()
        }

        if(phoneNumber){
            user.phoneNumber = phoneNumber
            await user.save()
        }

        if(sex){
            user.sex = sex
            await user.save()
        }
        
        res.status(200).json({
            success: true,
            message: "User details changed Successfully!",
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const ChangePassword = async(req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select("+password") 

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Please Login!"
            })
        }

        const { oldPassword, newPassword} = req.body

        const comparePass = await user.comparePassword(oldPassword)

        if(!comparePass){
            return res.status(400).json({
                success: false,
                message: "Given password is incorrect!"
            })
        }

            user.password = newPassword
            await user.save()
        
        res.status(200).json({
            success: true,
            message: "User details changed Successfully!",
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


/*------- Admin Controls -------*/

export const FindAllUsers = async(req, res) => {
    try {
        const users = await UserModel.find() 

        if(users.length === 0){
            return res.status(401).json({
                success: false,
                message: "No Users Found!"
            })
        }
        
        res.status(200).json({
            success: true,
            message: "User details found Successfully!",
            TotalUsers: users.length,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const FindUser = async(req, res) => {
    try {
        const user = await UserModel.findById(req.params.id) 

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not Found!"
            })
        }
        
        res.status(200).json({
            success: true,
            message: "User details found Successfully!",
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const DeleteUser = async(req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id) 

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not Found!"
            })
        }
        
        res.status(200).json({
            success: true,
            message: "User deleted Successfully!",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}