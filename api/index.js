import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"

dotenv.config()
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connexion  a la  base ok')
}).catch((err) => {
    console.log(Error)
});

const app = express()

app.use(express.json())
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use((err, req, res, next) =>{

const statusCode = err.statusCode || 500;
const message = err.message || "Erreur interne du serveur";
return res.status(statusCode).json({
    success:false,
    statusCode,
    message
});

});







app.listen(5000, () => {
    console.log(`Server ok au port: http://localhost:${process.env.PORT}`)
})