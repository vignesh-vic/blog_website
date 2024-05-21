import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../Firebase'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useNavigate,useParams } from 'react-router-dom'
import {useSelector} from 'react-redux'
function UpdatePost() {
    const { postId } = useParams()
    const token = localStorage.getItem("token");
    const navigate = useNavigate()
    const {currentUser} =useSelector((state)=>state.user)
    const [file, setFile] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [publishError, setPublishError] = useState(null)

    useEffect(()=>{
        try {
            const fetchPost = async()=>{  
             const res = await fetch(`http://localhost:5000/api/post/getposts?postId=${postId}`)
                const data = await res.json()
                if(!res.ok){
                    setPublishError(data.message)
                    return
                }
                if(res.ok){
                    setPublishError(null)
                    setFormData(data.posts[0])
                }
            }
            fetchPost()
        } catch (error) {
            console.log(error.message);  
        }
    },[])


    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError("Plese select an image")
                return
            }
            setImageUploadError(null)
            const storage = getStorage(app)
            const fileName = new Date().getTime() + '-' + file.name
            const storageRef = ref(storage, fileName)
            const upload = uploadBytesResumable(storageRef, file)
            upload.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setImageUploadProgress(progress.toFixed(0))
                },
                (error) => {
                    setImageUploadError('Image upload failed')
                    setImageUploadProgress(null)
                },
                () => {
                    getDownloadURL(upload.snapshot.ref).then((downlodURL) => {
                        setImageUploadProgress(null)
                        setImageUploadError(null)
                        setFormData({ ...formData, image: downlodURL })
                    })
                }
            )
        } catch (error) {
            setImageUploadError('Image upload failed')
            setImageUploadProgress(null)
            console.log(error);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`http://localhost:5000/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`

                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (!res.ok) {
                setPublishError(data.message)
                return
            }


            if (res.ok) {
                setPublishError(null)
                navigate(`/post/${data.slug}`)
            }

        } catch (error) {
            setPublishError('Something went wrong')
        }
    }

    return (
        <>
            <div className="p-3 max-w-3xl mx-auto min-h-screen">
                <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
                <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between ">
                        <TextInput placeholder="Title" id="title" required type="text" className="flex-1"
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            value={formData.title}
                        />
                        <Select
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            value={formData.category}
                        >
                            <option value="uncategorized">Select a category</option>
                            <option value="javascript">javascript</option>
                            <option value="reactjs">reactjs</option>
                            <option value="nextjs">nextjs</option>
                        </Select>
                    </div>
                    <div className="items-center gap-4 flex justify-between border-4 border-teal-600 border-dotted p-3">
                        <FileInput type='file' accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                        <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageUploadProgress}>
                            {
                                imageUploadProgress ? <div className="w-10 h-10">

                                    <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                                </div> : ("Upload Image")
                            }
                        </Button>
                    </div>
                    {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
                    {formData.image && (
                        <img
                            src={formData.image}
                            alt="upload"
                            className="h-72 mb-12 object-contain"
                            required
                        />
                    )}
                    <ReactQuill theme="snow" placeholder="Write Something..." className="mb-10 h-72" required onChange={(value) => {
                        setFormData({ ...formData, content: value })
                    }}
                    value={formData.content}
                    />
                    <Button type="submit" gradientDuoTone='purpleToPink' className="mb-4">Update Post</Button>
                    {
                        publishError && <Alert className="mt-5" color='failure'>{publishError}</Alert>
                    }
                </form>
            </div>

        </>
    );
}

export default UpdatePost;
