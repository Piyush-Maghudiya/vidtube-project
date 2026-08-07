import { Router } from "express"
import { verifyjwt, verifyAdmin } from "../middleware/auth.middleware.js"
import { getAdminStats, getAdminUsers, getAdminVideos, deleteAdminUser } from "../controllers/admin.controllers.js"

const router = Router()

// All admin routes require authentication and admin-level privileges
router.use(verifyjwt, verifyAdmin)

router.route("/stats").get(getAdminStats)
router.route("/users").get(getAdminUsers)
router.route("/users/:userId").delete(deleteAdminUser)
router.route("/videos").get(getAdminVideos)

export default router
