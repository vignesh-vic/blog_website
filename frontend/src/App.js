import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import Home from './pages/Home'
import About from './pages/About'
import SignUp from './pages/SignUp'
import Signin from './pages/Signin'
import DashBoard from './pages/DashBoard'
import Projects from './pages/Projects'
import Header from './components/Header'
import FooterPage from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/privateRoute';
import AdminRoute from './components/adminRoute';
import CreatePost from './pages/createPost';
import UpdatePost from './pages/updatePage';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/scrollToTop';
import Search from './pages/Search';

function App() {
  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />

      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/search' element={<Search />} />
          <Route element={<PrivateRoute />}>
            <Route path='/dashBoard' element={<DashBoard />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path='/create-post' element={<CreatePost />} />
            <Route path='/update-post/:postId' element={<UpdatePost />} />
          </Route>
          <Route path='/projects' element={<Projects />} />
          <Route path='/post/:postSlug' element={<PostPage />} />
        </Routes>
        <FooterPage />
      </BrowserRouter>
    </>
  );
}

export default App;
