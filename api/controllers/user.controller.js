import User from "../models/user.model.js";
import bcryptjs from "bcrypt"
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";



export const test = (req, res) => {
    res.json({
        message: "Test ok"
    })

};


export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "vous ne pouvez pas mettre à jour le compte"));

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true })
        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest)

    } catch (error) {
        next(error)

    }

}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "Cet compte ne peut-etre supprimer"))

    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("Utilisateur supprimer avec succès")

    } catch (error) {
        next(error)

    }
}

export const getUserListings = async (req,res,next) =>{
    if(req.user.id === req.params.id){
        try {
            // le id de utilisateur doit egal a la userRef
            const listings = await Listing.find({userRef:req.params.id});
            res.status(200).json(listings)
        } catch (error) {
            next(error)
            
        }
        
    }else{
        return next(errorHandler(401, "Vous ne pouvez consulter que votre propre annonce"))
    }


}

export const getUser = async(req, res, next) =>{
    try {
        const user = await User.findById(req.params.id);

        if(!user) return next(errorHandler(401, "Utilisateur non trouvé"));
        const {password:pass, ...rest} = user._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
        
    }

}