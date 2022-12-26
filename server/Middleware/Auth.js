import jwt from "jsonwebtoken"
import UserModel from "../Models/UserModel.js"

const Auth = async(req, res, next) => {
    try {
        const { token } = req.cookies

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Please Login!"
            })
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET)

        req.user = await UserModel.findById(decode._id)

        next()

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export default Auth