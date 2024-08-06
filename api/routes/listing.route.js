import express from "express"
import { createListing, deleteListing, editListing,getListing,geListingst } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createListing)
router.post("/edit/:id", verifyToken, editListing)
router.get("/get/:id", getListing)
router.delete("/delete/:id", verifyToken, deleteListing)
router.get("/get", geListingst)



export default router