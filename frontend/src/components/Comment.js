import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Modal, Textarea } from 'flowbite-react'
import Comments from './comments';

import { HiOutlineExclamationCircle } from 'react-icons/hi'
const token = localStorage.getItem("token");
function Comment({ postId }) {
    const navigate = useNavigate()
    const { currentUser } = useSelector(state => state.user)
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(null)
    const [comments, setComments] = useState([])
    const [showModel, setShowModel] = useState(false)
    const [commetToDelete, setCommentToDelete] = useState(null)

    useEffect(() => {
        const getcomments = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/comment/getPostComment/${postId}`)
                if (res.ok) {
                    const data = await res.json()
                    setComments(data)
                }

            } catch (error) {
                console.log(error.message);
            }

        }
        getcomments()
    }, [postId])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (comment.length > 200) {
                return;
            }
            const res = await fetch(`http://localhost:5000/api/comment/create`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: comment, postId, userId: currentUser._id })
            })
            const data = await res.json()
            if (res.ok) {
                setComment('');
                setCommentError(null);
                setComments([data, ...comments])

            }

        } catch (error) {
            setCommentError(error.message);
        }

    }

    const handleLike = async (commentId) => {

        try {
            if (!currentUser) {
                navigate('/sign-in')
                return;
            }
            const res = await fetch(`http://localhost:5000/api/comment/likeComment/${commentId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log(res.ok,"wha");
            if (res.ok) {
                const data = await res.json()
                setComments(comments.map((comment) =>
                    comment._id === commentId ? {
                        ...comment,
                        likes: data.likes,
                        numberOfLikes: data.likes.length

                    } : comment

                ))
            }
        } catch (error) {
            console.log(error);
        }
    }

    const commentEdit = async (comment, editedContent) => {
        setComments(
            comments.map((c) =>
                c._id === comment._id ? { ...c, content: editedContent } : c
            )

        )
    }

    const handleDelete = async (id) => {
        setShowModel(false)
        try {
            if (!currentUser) {
                navigate('/sign-in')
                return;
            }
            const res = await fetch(`http://localhost:5000/api/comment/deleteComment/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            if (res.ok) {
                const data = await res.json()
                setComments(
                    comments.filter((comment) => comment._id !== id)
                )
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser ? (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed id as:</p>
                    <img className='h-5 w-5 rounded-full object-cover' src={currentUser.profile} alt='' />
                    <Link to={'/dashboard?tab=profile'}
                        className='text-xs text-cyan-500 hover:underline'
                    >
                        @{currentUser.userName}
                    </Link>
                </div>
            ) : (<>
                <div className='text-sm text-teal-500 my-5 flex gap-1'>
                    You must be Signed in to comment.
                    <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
                        Sign In
                    </Link>
                </div>
            </>)}
            {
                currentUser && (
                    <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
                        <Textarea
                            placeholder='Add a comment...'
                            rows='3'
                            maxLength='200'
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                        />
                        <div className='flex justify-between items-center mt-5'>
                            <p className='text-gray-500 text-xs'>{200 - comment.length} characters remaining</p>
                            <Button outline gradientDuoTone='purpleToBlue'
                                type='submit'
                            >
                                Submit
                            </Button>
                        </div>
                        {
                            commentError && (
                                <Alert color='failure' className='mt-5'>
                                    {commentError}
                                </Alert>
                            )
                        }
                    </form>

                )
            }
            {
                comments.length === 0 ?
                    (
                        <p className='text-sm my-5 '>no comments yes</p>
                    ) : (
                        <>
                            <div className='text-sm my-5 flex items-center gap-1'>
                                <p>Comments</p>

                                <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                                    <p>
                                        {comments.length}
                                    </p>
                                </div>


                            </div>
                            {
                                comments.map(comment => (
                                    <Comments
                                        key={comment._id}
                                        comment={comment}
                                        handleLike={handleLike}
                                        commentEdit={commentEdit}
                                        token={token}
                                        handleDelete={
                                            (id) => {
                                                setShowModel(true)
                                                setCommentToDelete(id)
                                            }
                                        }

                                    />
                                ))
                            }
                        </>
                    )

            }
            <Modal show={showModel}
                onClose={() => setShowModel(false)}
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete this comment?</h3>
                    </div>
                    <div className="flex justify-around">
                        <Button color="failure" onClick={() => handleDelete(commetToDelete)}>Yes, I'm sure</Button>
                        <Button color="gray" onClick={() => { setShowModel(false) }}>No, cancel</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Comment
