import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import MyPage from './pages/MyPage/MyPage';
import ListingDetail from './pages/Listing/ListingDetail';
import SearchPage from './pages/Search/SearchPage';
import PostListing from './pages/Post/PostListing';
import ChatPage from './pages/Chat/ChatPage';
import NewListing from './pages/NewListing';

export default function App(){
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="listing/:id" element={<ListingDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="*" element={<div className="container py-5">404</div>} />
        <Route path="search" element={<SearchPage />} />
        <Route path="post" element={<PostListing />} /> 
        <Route path="/chat/:ownerId" element={<ChatPage />} />
        <Route path="/post" element={<NewListing />} />
      </Routes>
    </>
  );
}