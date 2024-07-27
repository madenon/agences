import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import { errorHandler } from "../utils/error.js"

export const signin = async (req, res, next) => {
    try{
        const { username, email, password } = req.body
        const newEmail = email.trim().toLowerCase()
    
        if (!username || !email || !password) {
            return res.status(500).json({ message: "Tout les champs sont requis" })
        }
        const existEmail = await User.findOne({ email })
        if (existEmail) {
            return res.status(422).json({ message: "cet Email existe déjà" })
        }
    
        const existUsername = await User.findOne({ username })
        if (existUsername) {
            return res.status(422).json({ message: "Cet nom existe déjà" })
        }
    
    
        if (password.trim().length < 8) {
            return res.status(402).json({ message: "Le mot de passe doit contenir au moins 8 caractères les espaces sont pas autorisés" })
                ;
        }
    
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ username, email: newEmail, password: hashedPassword })
        await newUser.save()
        res.status(201).json(`Utilisateur  ${newUser.email} a bien été  ajouté avec succès`)
    

    }catch(error){
        console.log(error)
        next(errorHandler(550, "Erreur de la fonction"))
    }

} 