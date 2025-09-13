import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import MyPage from './pages/MyPage/MyPage';
import ListingDetail from './pages/Listing/ListingDetail';
import SearchPage from './pages/Search/SearchPage';
// ❌ eski PostListing ni olib tashlaymiz
// import PostListing from './pages/Post/PostListing';
import ChatPage from './pages/Chat/ChatPage';
import NewListing from './pages/Post/NewListing';

export default function App(){
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="listing/:id" element={<ListingDetail />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="post" element={<NewListing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="mypage" element={<MyPage />} />

        {/* Chat: query params bilan (masalan: /chat?roomId=123&to=Landlord) */}
        <Route path="chat" element={<ChatPage />} />

        {/* 404 har doim eng oxirida */}
        <Route path="*" element={<div className="container py-5">404</div>} />
      </Routes>
    </>
  );
}