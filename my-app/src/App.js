import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import MyPage from './pages/MyPage/MyPage';
import Listing from './pages/Listing/Listing';
import SearchPage from './pages/Search/SearchPage';
import PostListing from './pages/Post/PostListing';

export default function App(){
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="listing/:id" element={<Listing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="*" element={<div className="container py-5">404</div>} />
        <Route path="search" element={<SearchPage />} />
        <Route path="post" element={<PostListing />} /> 
      </Routes>
    </>
  );
}