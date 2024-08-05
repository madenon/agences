import express from "express"
import { createListing, deleteListing, editListing } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createListing)
router.post("/edit/:id", verifyToken, editListing)
router.delete("/delete/:id", verifyToken, deleteListing)



export default router