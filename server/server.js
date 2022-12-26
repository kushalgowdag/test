import app from "./app.js"
import Database from "./Database/Database.js"
import cloudinary from "cloudinary"


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

Database()

app.listen(process.env.PORT, () => {
    console.log(`Server connected to Port: ${process.env.PORT}.`)
})