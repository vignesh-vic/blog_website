import { Button, Modal, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from 'react-icons/hi'
const token = localStorage.getItem("token");

function DashComment() {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true)
    const [showModel, setShowModel] = useState(false)
    const [commentIdToDelete, setCommentIdToDelete] = useState('')
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/comment/getcomments`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                }

                );
                const data = await res.json();

                if (res.ok) {
                    setComments(data);
                    if (data.comments.length < 6) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser?.isAdmin) {
            fetchComments();
        }
    }, [currentUser?._id]);

    const handleShowMore = async () => {
        const startIndex = comments?.length
        try {
            const res = await fetch(`http://localhost:5000/api/comment/getcomments?startIndex=${startIndex}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            })
            const data = await res.json()
            if (res.ok) {
                setComments((prev) => [
                    ...prev, ...comments
                ])
                if (data.comments.length < 7) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    const handleDeleteComment = async () => {
        setShowModel(false)
        try {
            const res = await fetch(`http://localhost:5000/api/comment/deleteComment/${commentIdToDelete}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`

                },

            })
            const data = await res.json()
            if (res.ok) {
                setComments((prev) => prev.filter((comment) => comment.comments._id !== commentIdToDelete))
                setShowModel(false)
            }
            else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <div className="table-auto  overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-500">
            {currentUser?.isAdmin && comments?.comments?.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>comment content</Table.HeadCell>
                            <Table.HeadCell>number of likes</Table.HeadCell>
                            <Table.HeadCell>postId</Table.HeadCell>
                            <Table.HeadCell>userId</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {comments.comments?.map((value) => (
                            <Table.Body className="divide-y" key={value._id}>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                                    <Table.Cell>
                                        {new Date(value.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {value.content}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {value.numberoflikes}
                                    </Table.Cell>
                                    <Table.Cell>{value.postId}</Table.Cell>
                                    <Table.Cell>
                                        {value.userId}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span className="font-medium text-red-500 hover:underline cursor-pointer" onClick={() => {
                                            setShowModel(true);
                                            setCommentIdToDelete(value._id)
                                        }}>Delete</span>
                                    </Table.Cell>

                                </Table.Row>
                            </Table.Body>
                        ))}

                    </Table>
                    {
                        showMore && (
                            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
                                Show more
                            </button>
                        )
                    }
                </>
            ) : (
                <p>you have no comments to show</p>
            )}
            
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
                        <Button color="failure" onClick={handleDeleteComment}>Yes, I'm sure</Button>
                        <Button color="gray" onClick={() => { setShowModel(false) }}>No, cancel</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default DashComment;
