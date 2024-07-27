import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

mongoose.connect(process.env.MONGO_URI).then(() =>{
    console.log('Connexion  a la  base ok')
}).catch((err)=>{
    console.log(Error)
});

const app = express()


app.listen(3000, () =>{
    console.log(`Server ok au port: http://localhost:${process.env.PORT}`)
})