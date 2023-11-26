import '../css/Main.css';
import React, { useState, useEffect } from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttributionIcon from '@mui/icons-material/Attribution';
import { Tooltip } from 'antd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import { Dropdown } from 'antd';
import axios from 'axios';
import SyncLoader from "react-spinners/SyncLoader";
import { useContext } from 'react';
import { ThemeContext } from '../src/ThemeContext';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Main = () => {

    window.scrollTo(0, 0);

    const navigate = useNavigate();
    const login = useSelector((state) => state.auth.login);

    useEffect(() => {
        if (!login) {
            navigate('/login');
        }
    }, [navigate, login]);

    if (!login) {
        return null;
    }

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isDarkMode } = useContext(ThemeContext);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const incrementViewCount = async (id) => {
        try {
            await axios.post(`http://hellafragilesite.com/avalanche.books.api/update_views.php?id=${id}`);
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('http://hellafragilesite.com/avalanche.books.api/books.php');
                setData(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);
    }, [currentPage]);


    const truncateDescription = (description, maxLength) => {
        if (description.length > maxLength) {
            return description.slice(0, maxLength) + '...';
        }
        return description;
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(data.length / itemsPerPage);
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    


    const [selectedDropdownValue, setSelectedDropdownValue] = useState(null);

    const handleDropdownItemClick = async (name, title, value) => {
        const formData = new FormData();
        formData.append("name", name || "");
        formData.append("title", title || "");
        formData.append("login", login);
        formData.append("type", value);

        console.log("Sending request with data:", formData);

        try {
            const response = await axios.post("http://hellafragilesite.com/avalanche.books.api/add_bookmark.php", formData);
            console.log("Response:", response.data);

            const data = response.data;
            if (data.status === 'success') {
                message.success(data.message);
            } else {
                message.error(data.message);
            }
        } catch (error) {
            console.error("Failed to send data to the server:", error);
        }
    };

   

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = data.slice(startIndex, endIndex);


    if (isLoading) {
        return <div className='loader'>
            <SyncLoader color="#A57AEB" />
        </div>;
    }


    
    return (
        <div className={`mainn ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="books">
                {currentPageData.map((book) => {
                    const { description, id, image, title, tags, likes, comments, views, author, name } = book;
                    
                    const items = [
                        {
                            key: '1',
                            label: (
                                <div target="_blank" rel="noopener noreferrer" className="dropdown-item" onClick={() => handleDropdownItemClick(name, title, 'reading')}>
                                    Reading
                                </div>
                            ),
                        },
                        {
                            key: '2',
                            label: (
                                <div target="_blank" rel="noopener noreferrer" className="dropdown-item" onClick={() => handleDropdownItemClick(name, title, 'intheplans')}>
                                    In the plans
                                </div>
                            ),
                        },
                        {
                            key: '3',
                            label: (
                                <div target="_blank" rel="noopener noreferrer" className="dropdown-item" onClick={() => handleDropdownItemClick(name, title, 'finished')}>
                                    Finished
                                </div>
                            ),
                        },
                        {
                            key: '4',
                            label: (
                                <div target="_blank" rel="noopener noreferrer" className="dropdown-item" onClick={() => handleDropdownItemClick(name, title, 'readlater')}>
                                    Read Later
                                </div>
                            ),
                        },
                        {
                            key: '5',
                            label: (
                                <div target="_blank" rel="noopener noreferrer" className="dropdown-item" onClick={() => handleDropdownItemClick(name, title, 'abandoned')}>
                                    Abandoned
                                </div>
                            ),
                        },
                    ];
                    
                    return (
                        <div className="book" key={title}>
                            <div className="top-box">
                                <div className="book-image">
                                    <Link to={`/detailed-page/${name}`}>
                                        <img
                                            src={image}
                                            alt=""
                                            onClick={() => incrementViewCount(id)} 
                                        />
                                    </Link>
                                </div>
                                <div className="info">
                                    <Link to={`/detailed-page/${name}`} >
                                        
                                    </Link>
                                    <Link to={`/detailed-page/${name}`} className="title" onClick={() => incrementViewCount(id)}>
                                        {title}
                                    </Link>
                                    <div className="desription">{truncateDescription(description, 248)}</div>
                                    
                                </div>
                            </div>
                            <div className="bottom-box">
                                <Link to={`/read/${book.name}`}>
                                    <button className="read">Read </button>
                                </Link>
                                <div className="stats">
                                    
                                    <Tooltip title="Views" placement="bottom" color={'#A57AEB'}>
                                        <div className="stat">
                                            <VisibilityIcon sx={{ fontSize: 18 }} /> {views}
                                        </div>
                                    </Tooltip>
                                    <Tooltip title="Author" placement="bottom" color={'#A57AEB'}>
                                        <div className="stat">
                                            <AttributionIcon sx={{ fontSize: 18 }} /> {author}
                                        </div>
                                    </Tooltip>
                                </div>
                                <Dropdown menu={{ items: items }} placement="bottom" trigger={['click']} className="bookmark">
                                    <button className="bookmark">
                                        <BookmarkIcon sx={{ fontSize: 18 }} />
                                        Bookmark
                                    </button>
                                </Dropdown>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Back
                </button>
                <span>{`Page ${currentPage} of ${Math.ceil(data.length / itemsPerPage)}`}</span>
                <button onClick={handleNextPage} disabled={currentPage === Math.ceil(data.length / itemsPerPage)}>
                    Forward
                </button>
            </div>


        </div>
    );
};

export default Main;
