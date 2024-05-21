import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../Firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, signoutSuccess, deleteUserStart, deleteUserSuccess, deleteUserFailure } from "../redux/user/userSlice";
import { toast } from 'react-toastify';
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'
const token = localStorage.getItem("token");

function DashProfile() {
    const { currentUser, error, loading } = useSelector((state) => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageProgress, setImageProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [formData, setFormData] = useState({})
    const [showModel, setShowModel] = useState(false)
    const filePickerRef = useRef()
    const dispatch = useDispatch()
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }

    }
    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }

    }, [imageFile])
    const uploadImage = async () => {
        setImageFileUploading(true)
        setImageUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const upload = uploadBytesResumable(storageRef, imageFile)
        upload.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setImageProgress(progress.toFixed(0))


            },
            (error) => {
                setImageUploadError("Could not upload image (File must be less then 2MB)")
                setImageProgress(null)
                setImageFile(null)
                setImageFileUrl(null)
                setImageFileUploading(false)
            },
            () => {
                getDownloadURL(upload.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL)
                    setImageProgress(null);
                    setFormData({ ...formData, profile: downloadURL })
                    setImageFileUploading(false)
                })
            }


        )
    }
    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData({ ...formData, [id]: value })

    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (Object.keys(formData).length === 0) {
            setUpdateUserError("No changes made ")

            return
        }
        if (imageFileUploading) {
            setUpdateUserError("Please wait for image to upload  ")

            return
        }

        try {
            dispatch(updateStart())
            const res = await fetch(`http://localhost:5000/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (!res.ok) {
                dispatch(updateFailure(data.message))
                setImageUploadError(data.message)
            } else {
                dispatch(updateSuccess(data))
                setUpdateUserSuccess(true)
            }
        } catch (error) {
            dispatch(updateFailure(error.message))
            setImageUploadError(error.message)

        }
    }

    useEffect(() => {
        if (updateUserSuccess === true) {
            toast.success('User Profile Update successful');
        }

    }, [updateUserSuccess]);

    const handleDeleteUser = async () => {
        setShowModel(false)
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`http://localhost:5000/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            const data = await res.json()
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message))
            } else {
                dispatch(deleteUserSuccess(data))
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }

    const handleSignout = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/user/signout`, {
                method: 'POST',

            })
            const data = await res.json()
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess())
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <div className="max-w-xl mx-auto p-3 w-full mb-10 lg:mb-0   ">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
                <div className=" relative w-32 h-32 mx-auto flex justify-center items-center cursor-pointer shadow-md rounded-full overflow-hidden" onClick={() => filePickerRef.current.click()}>
                    {imageProgress && (
                        <CircularProgressbar value={imageProgress || 0} text={`${imageProgress}%`} strokeWidth={6} styles={{
                            root: {
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0
                            },
                            path: {
                                stroke: `rgba(64, 150, 200,${imageProgress / 100})`
                            }
                        }} />
                    )}
                    <img src={imageFileUrl || currentUser.profile} alt="User" className={` rounded-full w-full h-full object-cover border-7 border-[lightgray] ${imageProgress && imageProgress < 100 && 'opacity-60'}`} />
                </div>
                {imageUploadError && (
                    <Alert color='failure'>{imageUploadError}</Alert>

                )}
                <TextInput type="text" id="userName" placeholder="userName" defaultValue={currentUser.userName} onChange={handleChange} />
                <TextInput type="email" id="email" placeholder="email" defaultValue={currentUser.email} onChange={handleChange} />
                <TextInput type="password" id="password" placeholder="password" onChange={handleChange} />
                <Button type="submit" gradientDuoTone='purpleToBlue' outline disabled={loading || imageFileUploading}>
                    {loading ? 'Loading...' : "Update"}
                </Button>
                {
                    currentUser && (
                        <Link to={'/create-post'}>
                            <Button type="button"
                                gradientDuoTone='purpleToPink'
                                className="w-full"
                                outline>
                                Create a post
                            </Button>
                        </Link>
                    )
                }
            </form>
            <div className="text-red-600 flex justify-between mt-5">
                <span onClick={() => setShowModel(true)} className="cursor-pointer">Delete Account</span>
                <span onClick={handleSignout} className="cursor-pointer">Sign Out</span>
            </div>
            {
                updateUserError && (
                    <Alert color='failure' className="mt-5">{updateUserError}</Alert>
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
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete your account?</h3>
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

export default DashProfile;
