import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { signinStart, signinSuccess, signinFailure } from "../redux/user/userSlice";
import { useDispatch, useSelector } from 'react-redux'
import Oauth from "../components/Oauth";
function Signin() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector(state => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error("Please fill all the fields"); // Display error toast
    }
    
    try {
      dispatch(signinStart())
      const res = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: {
           "Content-Type": "application/json"
          // Authorization: `Bearer ${token}`
          },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signinFailure(data.message))
      }
      if (res.ok) {
        dispatch(signinSuccess(data))
        localStorage.setItem("token", data.token);
        navigate("/");
      }
    } catch (error) {
      dispatch(signinFailure(error.message))
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-7">
        <div className="flex-1">
          <Link to="/" className="  font-bold dark:text-white text-4xl">
            <span className="px-2 bg-gradient-to-r from-blue-700 via-white-400 to-pink-500 rounded-xl py-1 text-white">
              MERN
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is demo project. You can sign up with your email and password or with Google
          </p>
        </div>
        <div className="flex-1 mx-2">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

            <div className="">
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="************"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <Oauth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Dont Have an Account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
