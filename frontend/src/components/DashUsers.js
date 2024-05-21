import { Button, Modal, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaCheck,FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from 'react-icons/hi'
const token = localStorage.getItem("token");

function DashUsers() {
    const { currentUser } = useSelector((state) => state.user);

    const [users, setUsers] = useState([]);
    
    const [showMore, setShowMore] = useState(true)
    const [showModel, setShowModel] = useState(false)
    const [userIdToDelete, setUserIdToDelete] = useState('')
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/post/getusers`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`

                    },
                }

                );
                const data = await res.json();
                console.log('data',data);
                if (res.ok) {
                    setUsers(data);
                    if (data.users.length < 7) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.isAdmin) {
            fetchUsers();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = users.length
        try {
            const res = await fetch(`http://localhost:5000/api/post/getusers?startIndex=${startIndex}`,{
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`

            },
                })
            const data = await res.json()
            if (res.ok) {
                setUsers((prev) => [...prev, ...data])
                if (data.users.length < 7) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    // const handleDelete = async () => {
    //     setShowModel(false);
    //     try {
    //         const res = await fetch(`http://localhost:5000/api/user/deleteuser/${userIdToDelete}/${currentUser._id}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         })
    //         const data = await res.json()
    //         if (!res.ok) {
    //             console.log(data.message);
    //         } else {
    //             setUserPosts((prev) =>
    //                 prev.filter((post) => post._id !== postIdToDelete)
    //             )
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const handleDeleteUser = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/user/delete/${userIdToDelete}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`

                },

            })  
            const data= await res.json()
            if (res.ok) {
                setUsers((prev) => prev.filter((user)=>user._id !== userIdToDelete))
                setShowModel(false)
            }     
            else{
                console.log(data.message);
            }
         } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div className="table-auto  overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-500">
            {currentUser.isAdmin && users?.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>user image</Table.HeadCell>
                            <Table.HeadCell>username</Table.HeadCell>
                            <Table.HeadCell>email</Table.HeadCell>
                            <Table.HeadCell>admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>

                        </Table.Head>
                        {users.map((user) => (
                            <Table.Body className="divide-y" key={user._id}>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                                    <Table.Cell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <img
                                            src={user.profile}
                                            alt={user.userName}
                                            className="w-10 rounded-full h-10 object-cover bg-gray-500"
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        {user.userName}
                                    </Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>{user.isAdmin ? <><FaCheck className='text-green-500' /></> : <><FaTimes className='text-red-500'/></>}</Table.Cell>
                                    <Table.Cell>
                                        <span className="font-medium text-red-500 hover:underline cursor-pointer" onClick={() => {
                                            setShowModel(true);
                                            setUserIdToDelete(user._id)
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
                <p>you have no users to show</p>
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
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete this user?</h3>
                    </div>
                    <div className="flex justify-around">
                        <Button color="failure" onClick={handleDeleteUser}>Yes, I'm sure</Button>
                        <Button color="gray" onClick={() => { setShowModel(false) }}>No, cancel</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default DashUsers;
