import '../css/Header.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../src/ThemeContext';
import HomeIcon from '@mui/icons-material/Home';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Avatar from './Avatar'; 
import { useSelector } from 'react-redux';


const Header = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [avatar, setAvatar] = useState(null);
    const login = useSelector((state) => state.auth.login);

    useEffect(() => {
        axios
            .get(`http://hellafragilesite.com/avalanche.books.api/get_avatar.php?login=${login}`)
            .then((response) => {
                const avatarUrl = response.data.avatar;
                const isValidAvatar = avatarUrl && avatarUrl.trim().length > 0 && avatarUrl !== 'http://hellafragilesite.com/';
                setAvatar(isValidAvatar ? avatarUrl : null);
            })
            .catch((error) => {
                console.error('Error fetching avatar:', error);
                setAvatar(null); 
            });
    }, []);

    const isAdmin = login === 'admin';

    return (
        <div className={`header ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className='top-menu'>
                <div className='top-menu-item'>
                    <Link to="/" className='top-menu-item'>
                        <HomeIcon sx={{ fontSize: 40 }} className='icon' />
                    </Link>
                </div>

                

                <div className='top-menu-item'>
                    <Link to="/search" className='top-menu-item'>
                        <SearchIcon sx={{ fontSize: 40 }} className='icon' />
                    </Link>
                </div>

                

                <div className='top-menu-item'>
                    <Link to="/user" className="top-menu-item">
                        <Avatar src={avatar} />
                    </Link>
                </div>

                {isAdmin && ( 
                    <div className='top-menu-item'>
                        <Link to="/addbook" className='top-menu-item'>
                            <AddCircleIcon sx={{ fontSize: 40 }} className='icon' />
                        </Link>
                    </div>
                )}

                {isAdmin && ( 
                    <div className='top-menu-item'>
                        <Link to="/addchapter" className='top-menu-item'>
                            <LibraryAddIcon sx={{ fontSize: 40 }} className='icon'/>
                        </Link>
                    </div>
                )}

                <div className='top-menu-item' onClick={toggleTheme}>
                    <div  className='top-menu-item'>
                        <Brightness7Icon sx={{ fontSize: 40 }} className='icon' />
                    </div>
                </div>

            </div>
            <div className='arrow' onClick={() => window.scrollTo(0, 0)}>
                <ArrowUpwardIcon sx={{ fontSize: 40 }} className='icon' />
            </div>
        </div>
    );
};

export default Header;
