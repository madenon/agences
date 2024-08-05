import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing =  async(req, res, next) =>{
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);

        
    } catch (error) {
        next(error)
        
    }
}

export const  deleteListing = async(req, res, next)=>{
    const listing = await Listing.findById(req.params.id)
    if(!listing){
        return next(errorHandler(401, "Annonce non trouvé"))
    }
    if(req.user.id  !== listing.userRef){
        return next(errorHandler(401, "Vous ne pouvez supprimer que votre propre annonce"))

    }
    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json("L'annonce a bien été supprimé")
        
    } catch (error) {
        next(error)
        
    }

}