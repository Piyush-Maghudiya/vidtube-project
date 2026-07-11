import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyjwt, verifyjwtOptional } from "../middleware/auth.middleware.js";
import { getVideoComment, addcomment, updatecomment, deletecomment } from "../controllers/comment.controller.js";

const router = Router()

router.route("/:vedioid").get(verifyjwtOptional, getVideoComment);

router.use(verifyjwt, upload.none()); // Apply verifyJWT middleware to all routes in this file
router.route("/:videoid").post(addcomment);
router.route("/:commentid").patch(updatecomment);
router.route("/:commentid").delete(deletecomment);

export default router
