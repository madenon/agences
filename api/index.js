import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

mongoose.connect(process.env.MONGO_URI).then(() =>{
    console.log('Connexion ok')
}).catch((err)=>{
    console.log(Error)
});

const app = express()


app.listen(3000, () =>{
    console.log(`Server ok`)
})