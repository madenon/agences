import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import listingRouter from "./routes/listing.route.js"
import path from "path"
import   cookieParser from "cookie-parser"

dotenv.config()
mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connexion  a la  base ok')
}).catch((err) => {
    console.log(err);
});

const PORT = 5000

const __dirname = path.resolve();
const app = express()

app.use(express.json())

app.use(cookieParser())



app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname,'client','dist', 'index.html'));
   });
   

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
    console.log(`Server ok au port: http://localhost:${PORT}`)
})