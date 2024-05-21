import { useEffect, useState } from "react"
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux'
import { Button, Textarea } from "flowbite-react";

function Comments({ comment, handleLike, commentEdit, handleDelete, token }) {
    const [user, setUser] = useState({})
    const [isEditing, setEditiing] = useState(false)
    const [editedContent, setEditedContent] = useState(comment.content)
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/user/getby/${comment.userId}`)
                if (res.ok) {
                    const data = await res.json()
                    setUser(data)
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser()
    }, [comment])
    const handleEdit = () => {
        setEditiing(true)
        setEditedContent(comment.content)
    }
 
    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/comment/editComment/${comment._id}`,
                {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(
                        {
                            content: editedContent
                        }
                    )
                }


            )

            if (res.ok) {
                setEditiing(false)
                commentEdit(comment, editedContent)
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <div className="flex p-4 border-b dark:border-gray-600 text-sm">
                <div className="flex-shrink-0 mr-3">

                    <img className="w-10 h-10 rounded-full p-2 bg-gray-200" src={user.profile} alt={user.userName} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center mb-1">
                        <span className="font-bold mr-1 text-xs truncate">{user ? `@${user.userName}` : "anonymous user"}</span>
                        <span className="text-gray-500 text-xs">{moment(comment.createdAt).fromNow()}

                        </span>

                    </div>
                    {isEditing ? (
                        <>
                            <Textarea
                                className="mb-2"
                                rows='3'
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    className=""
                                    gradientDuoTone='purpleToBlue'
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                                <Button
                                    type="button"
                                    className=""
                                    gradientDuoTone='purpleToBlue'
                                    outline
                                    onClick={() => setEditiing(false)}
                                >
                                    cancel
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-500 pb-2">
                                {comment.content}
                            </p>
                            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit  gap-2">
                                <button type="button" onClick={() => { handleLike(comment._id) }} className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'} `}>
                                    <FaThumbsUp className="text-sm" />
                                </button>
                                <p>
                                    {
                                        comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")
                                    }
                                </p>
                                {
                                    currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                        <button
                                            onClick={handleEdit}
                                            type='button'
                                            className="text-gray-400 hover:text-blue-500"
                                        >
                                            Edit
                                        </button>
                                    )
                                }
                                {
                                    currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                        <button
                                                onClick={() => handleDelete(comment._id)}
                                            type='button'
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            delete
                                        </button>
                                    )
                                }
                            </div>
                        </>
                    )}

                </div>


            </div>

        </>
    )

}


export default Comments 