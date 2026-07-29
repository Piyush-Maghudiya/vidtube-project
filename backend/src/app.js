import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import { rateLimit } from "express-rate-limit"

const app = express()

// 1. Enable CORS as the first middleware to process preflight OPTIONS requests
app.use(cors({
    origin: function (origin, callback) {
        console.log("Incoming CORS request from origin:", origin);
        if (!origin) {
            console.log("No origin header, allowing request");
            return callback(null, true);
        }
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175'
        ];
        const envOrigin = process.env.CORS_ORIGIN?.trim();
        if (envOrigin) {
            allowedOrigins.push(envOrigin);
        }
        console.log("Allowed origins:", allowedOrigins);
        if (allowedOrigins.indexOf(origin) !== -1) {
            console.log("Origin allowed");
            callback(null, true);
        } else {
            console.log("Origin rejected by CORS");
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))

// 2. Set secure HTTP headers (configured to support cross-origin resource requests)
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// 3. Define rate limit rules (100 requests per 15 minutes per IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
})

// Apply rate limiter to API endpoints
app.use("/api", limiter)

// 4. Body parsing and standard middlewares
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser()) 
 
// import routes
import userRouter from "./routes/user.routes.js" 
import commentRouter from "./routes/comment.routes.js"
import videoRouter from "./routes/video.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"

// route decalre
app.use("/api/v1/users",userRouter)
app.use("/api/v1/comment",commentRouter)
app.use("/api/v1/video",videoRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/playlist",playlistRouter)
app.use("/api/v1/subcriptions",subscriptionRouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/dashboard",dashboardRouter)
app.use("/api/v1/healthcheck",healthcheckRouter)

// Global catch-all error handling middleware
import errorHandler from "./middleware/error.middleware.js"
app.use(errorHandler)

export default app

