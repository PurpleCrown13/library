import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from "./Home";
import About from "./About";
import DetailedPage from "./DetailedPage";
import Read from "./Read";
import AddBook from "./AddBook";
import AddChapter from "./AddChapter";
import Search from './Search';
import User from './User';
import Register from './Register';
import Login from './Login';
import News from './News';

const AnimatedRoutes = () => {

    const location = useLocation();

    return (
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/user" element={<User />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/addbook" element={<AddBook />} />
                <Route path="/addchapter" element={<AddChapter />} />
                <Route path="/search" element={<Search />} />
                <Route path="/news" element={<News />} />
                <Route exact path="/read/:name" element={<Read />} />
                <Route exact path="/detailed-page/:name" element={<DetailedPage />} />
            </Routes>
    );
}

export default AnimatedRoutes;