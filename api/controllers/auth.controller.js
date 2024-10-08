import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import { errorHandler } from "../utils/error.js"
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    try {
        const { username, email, password, password2 } = req.body
        const newEmail = email.trim().toLowerCase()

 if(!username ||!email ||!password || !password2) return next(errorHandler(400, "champs vide impossible"))
        if (password !== password2) {
            return next(errorHandler(422, "Les mots de passe ne sont pas identique"))

        } else {
            password === password2
        }


        const existEmail = await User.findOne({ email })
        if (existEmail) return next(errorHandler(422, "cet Email existe déjà"))



        const existUsername = await User.findOne({ username })
        if (existUsername) return next(errorHandler(422, "cet nom existe déjà"))


        if (password.trim().length < 8) {
            return next(errorHandler("Le mot de passe ne doit pas etre inféieur à 8"))
                ;
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ username, email: newEmail, password: hashedPassword })
        await newUser.save()
        res.status(201).json(`Utilisateur  ${newUser.email} a bien été  ajouté avec succès`)


    } catch (error) {
        next(error)

    }

}

// la connexion apres nl inscription  

export const signin = async (req, res, next) => {
    const { email, password } = req.body
    try {
        // on verifie si l utilisateur existe déjà 
        const newEmail = email.trim()
        const validUser = await User.findOne({ email: newEmail })
        if (!validUser) return next(errorHandler(404, "Utilisateur n'existe pas , vous n'avez pas de compte"))
        // verifier si le  mot de passe est correct 

        const passwordValid = password.trim();
        const passwordValid2 = validUser.password.trim()
        const validePassword = bcrypt.compareSync(passwordValid, passwordValid2)
        if (!validePassword) return next(errorHandler(401, "Mot de passe invalide"))
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)



    } catch (error) {
        next(error)

    }

}


export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = user._doc
            res.cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest)
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar:req.body.photo });
            await newUser.save();
            const token =jwt.sign({id:newUser._id}, process.env.JWT_SECRET);
            const {password:pass, ...rest} = newUser._doc;
            res.cookie("access_token", token, {httpOnly:true}).status(200).json(rest)

        }

    } catch (error) {
        next(error)

    }
}

export  const signOut = async(req, res, next) =>{
    try {
        res.clearCookie("access_token");
        res.status(200).json("Utilisateur a bien  été déconnecté")
        
    } catch (error) {
        next(error)
        
    }

}