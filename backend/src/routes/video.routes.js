import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyjwt, verifyjwtOptional } from "../middleware/auth.middleware.js";
import { getallvideo,publishvideo,getvideoByid,updatevideo,deletevideo,togglepublishstatus } from "../controllers/video.controller.js";

const  router = Router()

router.route("/").get(verifyjwtOptional, getallvideo)
router.route("/:videoId").get(verifyjwtOptional, getvideoByid)

router.use(verifyjwt)

    router.route("/").post(upload.fields([
           {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            ]),
            publishvideo
)

router.route("/:videoId").delete(deletevideo)
                           .patch(upload.single("thumbnail"),updatevideo)
router.route("/toggle/publish/:videoId").patch(togglepublishstatus)
export default router