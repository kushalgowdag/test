import mongoose from "mongoose";

const Database = async() => {
    try {
        const {connection} = await mongoose.connect(process.env.DB)
        console.log(`Database connected to: ${connection.host}.`)
    } catch (error) {
        console.log(error)
    }
}

export default Database