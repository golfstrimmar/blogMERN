import React from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import Home from '../pages/Home';
import PostPage from '../pages/PostPage/PostPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Posts from "../pages/Posts/Posts";

function AppRouter(props) {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/posts" element={<Posts/>}/>
      <Route path="/post/:id" element={<PostPage/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
    </Routes>
  );
}

export default AppRouter;

