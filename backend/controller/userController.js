const { errorHandler } = require("../utils/error")
const bcryptjs = require("bcryptjs");
const User = require("../models/userModel");

const test = (req, res) => {
    res.json({ messae: "API is working" })
}

const updateUser = async (req, res, next) => {
    if (!req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to do update this user'))
    }

    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)

    }
    if (req.body.userName) {
        if (req.body.userName.length < 7 || req.body.userName.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'))
        }
        if (req.body.userName.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contain spaces'))
        }
        if (req.body.userName !== req.body.userName.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'))
        }
        if (!req.body.userName.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username only contain letters and numbers'))
        }
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                userName: req.body.userName,
                email: req.body.email,
                profile: req.body.profile,
                password: req.body.password
            }
        }, { new: true })
        const { password, ...rest } = updateUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && !req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to do delete this user'))

    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json("User has been deleted")
    } catch (error) {

    }
}

const signout = async (req, res, next) => {
    try {
        res.setHeader('Authorization', '');
        res.status(200).json("User has been signed out");
    } catch (error) {
        next(error)
    }
}

const getusers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to see all users"))
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 20;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit)

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc
            return rest
        })

        res.status(200).json(usersWithoutPassword)
        const totalUsers = await User.countDocuments()
        const now = new Date()
        const oneMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthsAgo }
        })
        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers
        })
    } catch (error) {

    }
}


const getUser = async (req, res, next) => {
    try {
        const users = await User.findById(req.params.userId)
        if (!users) {
            return next(errorHandler(404, "User not found"))
        }
        const {password,...rest } = users._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

module.exports = { test, updateUser, deleteUser, signout, getusers, getUser }