import { Video } from "../models/video.models.js"
import User from "../models/user.models.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"

const getAdminStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments()
    const totalVideos = await Video.countDocuments()

    const viewsResult = await Video.aggregate([
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ])
    const totalViews = viewsResult[0]?.totalViews || 0

    // Active users: Users who have logged in at least once (i.e. lastLogin field exists)
    const activeUsers = await User.countDocuments({ lastLogin: { $exists: true } })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    totalUsers,
                    totalVideos,
                    totalViews,
                    activeUsers
                },
                "Admin statistics fetched successfully"
            )
        )
})

const getAdminUsers = asyncHandler(async (req, res) => {
    const users = await User.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos"
            }
        },
        {
            $project: {
                username: 1,
                email: 1,
                fullname: 1,
                avatar: 1,
                role: 1,
                lastLogin: 1,
                createdAt: 1,
                videoCount: { $size: "$videos" }
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, users, "Admin users logs fetched successfully"))
})

const getAdminVideos = asyncHandler(async (req, res) => {
    const videos = await Video.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $addFields: {
                owner: { $first: "$ownerDetails" }
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                thumbnail: 1,
                views: 1,
                duration: 1,
                isPublished: 1,
                createdAt: 1,
                "owner.username": 1,
                "owner.fullname": 1,
                "owner.avatar": 1,
                "owner.email": 1
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Admin videos catalog fetched successfully"))
})

const deleteAdminUser = asyncHandler(async (req, res) => {
    const { userId } = req.params

    // Prevent deleting oneself
    if (req.user._id.toString() === userId.toString()) {
        throw new ApiError(400, "You cannot delete your own admin account")
    }

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // Clean up their uploaded videos
    await Video.deleteMany({ owner: userId })

    // Delete user
    await User.findByIdAndDelete(userId)

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User and all their uploaded videos deleted successfully"))
})

export { getAdminStats, getAdminUsers, getAdminVideos, deleteAdminUser }
