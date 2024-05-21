import React, { useEffect, useState } from 'react'
import { HiAnnotation, HiArrowNarrowUp, HiDocument, HiDocumentText, HiOutlineUser, HiOutlineUserGroup } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { Button, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
function DashBoardComp() {
    const [users, setUsers] = useState([])
    const [comments, setComments] = useState([])
    const [posts, setPosts] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPost, setTotalPost] = useState(0)
    const [totalComments, setTotalComment] = useState(0)
    const [lastMonthUsers, setLastMonthUsers] = useState(0)
    const [lastMonthPosts, setLastMonthPosts] = useState(0)
    const [lastMonthComment, setLastMonthComment] = useState(0)
    const { currentUser } = useSelector((state) => state.user)
    const token = localStorage.getItem("token");
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/post/getusers?limit=5`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                    }
                )
                const data = await res.json()
                if (res.ok) {
                    setUsers(data.users)
                    setTotalUsers(data.length)
                    setLastMonthUsers(data.lastMonthUsers)
                }
            } catch (error) {

            }

        }
        const fetchPosts = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/post/getposts?limit=5`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                    }
                )
                const data = await res.json()
                if (res.ok) {
                    setPosts(data.posts)
                    setTotalPost(data.totalPosts)
                    setLastMonthPosts(data.lastMonthPosts)
                }
            } catch (error) {
                console.log(error.message);
            }

        }
        const fetchComments = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/comment/getcomments?limit=5',
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                    })
                const data = await res.json()
                if (res.ok) {
                    setComments(data.comments)
                    setTotalComment(data.totalComments)
                    setLastMonthComment(data.totalComments)
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        if (currentUser.isAdmin) {
            fetchUsers()
            fetchPosts()
            fetchComments()
        }
    }, [currentUser, token])
    return (
        <div className='p-3 md:mx-auto'>

            <div className='flex-wrap flex gap-4 justify-center'>
                <div className='flex flex-col dark:bg-slate-800 gap-4 md:w-72 w-ful rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-gray-500 text-md uppercase pl-2 pt-2'>Total Users</h3>
                            <p className='text-2xl p-3 pl-2'>  {totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg mt-2 mr-2' />

                    </div>
                    <div className='flex gap-2 text-sm'>
                        <span className='text-green-500 flex items-center pl-2 '>
                            {/* <HiArrowNarrowUp/> */}
                            {lastMonthUsers}
                        </span>
                    </div>
                </div>
                <div className='flex flex-col dark:bg-slate-800 gap-4 md:w-72 w-ful rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-gray-500 text-md uppercase p-2'>Total Comments</h3>
                            <p className='text-2xl p-3'>  {totalComments}</p>
                        </div>
                        <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg mt-2 mr-2' />

                    </div>
                    <div className='flex gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            {/* <HiArrowNarrowUp/> */}
                            {lastMonthUsers}
                        </span>
                    </div>
                </div>
                <div className='flex flex-col dark:bg-slate-800 gap-4 md:w-72 w-ful rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-gray-500 text-md uppercase p-2'>Total posts</h3>
                            <p className='text-2xl p-3'>{totalPost}</p>
                        </div>
                        <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg mt-2 mr-2' />
                    </div>
                    <div className='flex gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            {lastMonthUsers}
                        </span>
                    </div>
                </div>
            </div>
            <div className='mt-4'>
                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>
                            recent Posts
                        </h1>
                        <Button outline gradientDuoTone="purpleToPink">
                            <Link  to={'/dashboard?tab=users'}>
                                See all
                            </Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>
                                post image
                            </Table.HeadCell>
                            <Table.HeadCell>
                                postname
                            </Table.HeadCell>
                            <Table.HeadCell>
                                category
                            </Table.HeadCell>

                        </Table.Head>
                        {
                            posts && posts.map((post)=>(
                                <Table.Body key={post._id} className='divide-y'>
                                    <Table.Row className='bg-white  dark:border-gray-800 dark:bg-gray-800'>
                                    <Table.Cell>
                                        <img
                                        src={post.image}
                                        alt='user'
                                        className='w-14 h-10 rounded-md bg-gray-500'                
                                                        />      
                                    </Table.Cell>
                                    <Table.Cell className='w-96'>
                                        {post.title}
                                    </Table.Cell>
                                    <Table.Cell className='w-5'>
                                        {post.category}
                                    </Table.Cell>
                                    </Table.Row>

                                </Table.Body>
                            )
                        )}
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default DashBoardComp