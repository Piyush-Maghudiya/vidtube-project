import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"

const app = express()
app.use(express.json());
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

export default app

