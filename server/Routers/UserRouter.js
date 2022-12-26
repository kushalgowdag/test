import express from "express"
import { ChangePassword, DeleteUser, EditProfile, FindAllUsers, FindUser, LoginUser, Logout, RegisterUser, UserProfile } from "../Controllers/UserController.js"
import Auth from "../Middleware/Auth.js"

const router = express.Router()

router.route("/register").post(RegisterUser)
router.route("/login").post(LoginUser)
router.route("/logout").post(Auth, Logout)
router.route("/profile").get(Auth, UserProfile)
router.route("/profile/edit").put(Auth, EditProfile)
router.route("/profile/edit/password").put(Auth, ChangePassword)

router.route("/users/all").get(Auth, FindAllUsers)
router.route("/user/:id").get(Auth, FindUser).delete(Auth, DeleteUser)


export default router