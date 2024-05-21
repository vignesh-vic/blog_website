const { errorHandler } = require("../utils/error");
const comment = require("../models/commentModel");


const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body

        if (userId !== req.user.id) {

            return next(errorHandler(403, "You not allowed to create this comment"))

        }

        const newComment = new comment(
            {
                content,
                postId,
                userId

            }
        )
        await newComment.save()
        res.status(200).json(newComment)

    } catch (error) {

    }
}

const getPostComment = async (req, res, next) => {

    try {
        const comments = await comment.find({ postId: req.params.postId }).sort({
            createdAt: -1

        })
        res.status(200).json(comments)


    } catch (error) {

    }

}

const likeCommment = async (req, res, next) => {
    try {
        const likecomment = await comment.findById(req.params.commentId)
        if (!likecomment) {
            return next(errorHandler(404, 'Comment not found'))
        }
        const userIndex = likecomment.likes.indexOf(req.user.id)
        if (userIndex == -1) {
            likecomment.numberOfLikes += 1
            likecomment.likes.push(req.user.id)
        }
        else {
            likecomment.numberOfLikes -= 1
            likecomment.likes.splice(userIndex, 1)
        }
        await likecomment.save()
        res.status(200).json(likecomment)
    } catch (error) {
        next(error)
    }


}
const editComment = async (req, res, next) => {
    try {
        const comments = await comment.findById(req.params.commentId)
        if (!comments) {
            return next(errorHandler(404, 'Comment not found'))
        }

        if (comments.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'you are not allowed to edit this comment'))

        }
        const editedComment = await comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content: req.body.content
            },
            { new: true }
        )
        res.status(200).json(editedComment)
    } catch (error) {
        next(error)
    }

}

const deleteComment = async (req, res, next) => {
    try {
        const comments = await comment.findById(req.params.commentId)
        if (!comments) {
            return next(errorHandler(404, 'Comment not found'))
        }
        if (comments.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'you are not allowed to delete this comment'))

        }
        await comment.findByIdAndDelete(req.params.commentId)
        res.status(200).json('Comment has been deleted')
    } catch (error) {
        next(error)
    }
}


const getComments = async (req, res, next) => {
    if (!req.user.isAdmin)
        return next(errorHandler(403, 'you are not allowed to get all comments'))
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.sort === `desc` ? -1 : 1
        const comments = await comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit)

        const totalComments = await comment.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        const lastMonthCommnets = await comment.countDocuments({ createdAt: { $gte: oneMonthAgo } })
        res.status(200).json({ comments, totalComments, lastMonthCommnets })
    } catch (error) {
        next(error)
    }
}

module.exports = { createComment, getPostComment, likeCommment, editComment, deleteComment, getComments };
