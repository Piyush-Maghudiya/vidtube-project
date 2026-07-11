import { Router } from "express";
import {
    createtweet,
    updatetweet,
    getalltweet,
    deletetweet
} from "../controllers/tweet.controller.js"

import { verifyjwt, verifyjwtOptional } from "../middleware/auth.middleware.js"
const router = Router();

router.route("/users/:userId").get(verifyjwtOptional, getalltweet);

router.use(verifyjwt)
router.route("/").post(createtweet)
router.route("/:tweetId").patch(updatetweet)
                         .delete(deletetweet);
                        
export default router
