import mongoose from "mongoose";
import 'dotenv/config'

const connectionURL = process.env.MONGODB_CONNECTION_URL;

export function connectToMongoDB () {
    mongoose.connect(connectionURL)
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected')
    })
    mongoose.connection.on('error', (err) => {
        console.log(err)
    })
}

