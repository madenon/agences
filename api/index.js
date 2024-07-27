import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRouter  from "./routes/user.route.js"

dotenv.config()
mongoose.connect(process.env.MONGO_URI).then(() =>{
    console.log('Connexion  a la  base ok')
}).catch((err)=>{
    console.log(Error)
});

const app = express()

app.get('/', (req, res) =>{
    res.json({message:"Hello"})
})

app.use("/api",  userRouter)


app.listen(5000, () =>{
    console.log(`Server ok au port: http://localhost:${process.env.PORT}`)
})