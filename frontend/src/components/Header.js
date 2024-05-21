import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation ,useNavigate} from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";

function Header() {
  const [searchTerm, setsearchTerm] = useState('')
  const path = useLocation().pathname;
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    if (searchTermFromUrl) {
      setsearchTerm(searchTermFromUrl)
    }
  }, [location.search])

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
  const handleSubmit=(e)=>{
    e.preventDefault()
    const urlParams=new URLSearchParams(location.search)
    urlParams.set('searchTerm',searchTerm)
    const searchQuery=urlParams.toString()
    navigate(`/search?${searchQuery}`)

  }
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 bg-gradient-to-r from-blue-700 via-white-400 to-pink-500 rounded-xl py-1 text-white">
          MERN
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e)=>setsearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-9 lg:hidden" color="gray">
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-9 hidden  sm:inline" color="gray" pill onClick={() => dispatch(toggleTheme())}>
          <FaMoon />
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={currentUser.profile} rounded />}
          >
            <Dropdown.Header>
              <span className="block font-semibold pb-2">
                {currentUser.userName}
              </span>
              <span className="block font-semibold"> {currentUser.email}</span>
            </Dropdown.Header>

            <Link to={"dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="signin">
            <Button gradientDuoTone={"purpleToBlue"} outline>
              sign in
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse className="text-center">
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/" >Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
