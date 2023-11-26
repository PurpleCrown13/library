import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../css/DetailedPage.css';
import TagIcon from '@mui/icons-material/Tag';
import { Tabs } from 'antd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Tooltip, Dropdown } from 'antd';
import { Favorite } from '@mui/icons-material';
import axios from 'axios';
import SyncLoader from "react-spinners/SyncLoader";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

const DetailedPage = () => {


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

    const { name } = useParams();
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [chapters, setChapters] = useState([]);
    const { TabPane } = Tabs;


    const [commentText, setCommentText] = useState("");

    const handleCommentSubmit = async () => {

        const avatarResponse = await axios.get(
            `http://hellafragilesite.com/avalanche.books.api/get_avatar.php?login=${login}`
        );
        const avatar = avatarResponse.data.avatar;

        const formData = new FormData();
        formData.append("login", login);
        formData.append("comment_rating", 0);
        formData.append("content", commentText);
        formData.append("name", name);
        formData.append("avatar", avatar);

        try {
            await axios.post("http://hellafragilesite.com/avalanche.books.api/add_comment.php", formData);
            fetchComments();
            setCommentText("");
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchBook();
        fetchComments();
    }, []);

    const fetchBook = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://hellafragilesite.com/avalanche.books.api/books.php?name=${name}`);
            const bookData = response.data.find((book) => book.name === name);
            setBook(bookData);

            // Fetch chapters from API
            const chaptersResponse = await axios.get(`http://hellafragilesite.com/avalanche.books.api/read.php?name=${name}`);
            const chaptersData = chaptersResponse.data;
            setChapters(chaptersData);

            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://hellafragilesite.com/avalanche.books.api/comments.php?name=${name}`);
            const commentsData = await Promise.all(response.data.map(async (comment) => {
                const avatarResponse = await axios.get(
                    `http://hellafragilesite.com/avalanche.books.api/get_avatar.php?login=${comment.login}`
                );
                const avatar = avatarResponse.data.avatar;
                return { ...comment, avatar };
            }));
            setComments(commentsData);
        } catch (error) {
            console.error(error);
        }
    };



    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://hellafragilesite.com/avalanche.books.api/delete_comment.php?id=${commentId}`);
            fetchComments();
        } catch (error) {
            console.error(error);
        }
    };

    const handleLikeDislikeComment = async (commentId, action) => {
        try {
            const localStorageKey = `comment_${commentId}`;
            const isLikedOrDisliked = localStorage.getItem(localStorageKey);

            if (!isLikedOrDisliked) {
                await axios.put(`http://hellafragilesite.com/avalanche.books.api/like_dislike_comment.php`, {
                    id: commentId,
                    action: action,
                });

                localStorage.setItem(localStorageKey, action);

                fetchComments();
            } else {
                alert(`You already ${isLikedOrDisliked} this comment.`);
            }
        } catch (error) {
            console.error(error);
        }
    };


    const renderComments = () => {
        if (comments.length === 0) {
            return <div className="no-comments">Unfortunately, there are no comments. ☠️</div>;
        }
        return comments.map((comment) => {
            const localStorageKey = `comment_${comment.id}`;
            const isLiked = localStorage.getItem(localStorageKey) === 'like';
            const isDisliked = localStorage.getItem(localStorageKey) === 'dislike';

            return (
                <div className='thread-comment' key={comment.id}>
                    <div className='thread-top-box'>
                        <img src={comment.avatar} alt={comment.login} className='thread-image' />
                        <div className={`thread-title ${comment.login === 'admin' ? 'admin-text' : ''}`}>
                            {comment.login}
                        </div>
                    </div>
                    <div className='thread-content'>{comment.content}</div>
                    <div className='thread-top-box'>
                        <div>
                            <ThumbUpAltIcon
                                sx={{ fontSize: 30, color: isLiked ? 'forestgreen' : 'black' }}
                                className='like'
                                onClick={() => handleLikeDislikeComment(comment.id, 'like')}
                            />
                        </div>
                        <div>
                            <ThumbDownAltIcon
                                sx={{ fontSize: 30, color: isDisliked ? 'crimson' : 'black' }}
                                className='dislike'
                                onClick={() => handleLikeDislikeComment(comment.id, 'dislike')}
                            />
                        </div>
                        <div className='thread-rating'>{comment.comment_rating}</div>
                    </div>
                    {(comment.login === login || login === "admin") && (
                        <div className='thread-delete-container'>
                            <button onClick={() => handleDeleteComment(comment.id)} className='thread-delete'>DELETE</button>
                        </div>
                    )}
                </div>
            );
        });
    };



    const items = [
        {
            key: '1',
            label: `Description`,
            children: book?.description,
        },
        {
            key: '2',
            label: `Table of contents`,
            children: chapters.map((chapter, index) => (
                <li className="glava" key={index}>{chapter.part} </li>
            )),
        },
    ];


    const items2 = [
        {
            key: '1',
            label: (
                <div target="_blank" rel="noopener noreferrer" className="dropdown-item" onClick={() => handleDropdownItemClick('reading')}>
                    Reading
                </div>
            ),
        },
        
        {
            key: '2',
            label: (
                <div target="_blank" rel="noopener noreferrer" className="dropdown-item" onClick={() => handleDropdownItemClick('intheplans')}>
                    In the plans
                </div>
            ),
        },
        {
            key: '3',
            label: (
                <div target="_blank" rel="noopener noreferrer" className="dropdown-item" onClick={() => handleDropdownItemClick('finished')}>
                    Finished
                </div>
            ),
        },
        {
            key: '4',
            label: (
                <div target="_blank" rel="noopener noreferrer"  className="dropdown-item" onClick={() => handleDropdownItemClick('readlater')}>
                    Read Later
                </div>
            ),
        },
        {
            key: '5',
            label: (
                <div target="_blank" rel="noopener noreferrer"  className="dropdown-item" onClick={() => handleDropdownItemClick('abandoned')}>
                    Abandoned
                </div>
            ),
        },
    ];



    const [selectedDropdownValue, setSelectedDropdownValue] = useState(null);
    
    const handleDropdownItemClick = async (value) => {
        setSelectedDropdownValue(value);

        const formData = new FormData();
        formData.append("name", book?.name || "");
        formData.append("title", book?.title || "");
        formData.append("login", login);
        formData.append("type", value);

        try {
            const response = await axios.post("http://hellafragilesite.com/avalanche.books.api/add_bookmark.php", formData);
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



    if (isLoading) {
        return <div className='loader'>
            <SyncLoader color="#A57AEB" />
        </div>;
    }

    return (
        <div className="app">
            <Helmet>
                <title>{book.title}</title>
            </Helmet>
            <div className="main">
                <div>
                    <div>
                        <div className="detailed">
                            <img src={book.image} alt={book.title} className="detailed-image" />
                            <div className="detailed-info">
                                <h2 className="detailed-title">{book.title}</h2>
                                <p className="detailed-author">Author: {book.author}</p>
                                <div className="detailed-stats">
                                    <Tooltip title="Views" placement="bottom" color={'#A57AEB'} className="detailed-views">
                                        <div>
                                            <VisibilityIcon sx={{ fontSize: 16 }} /> {book.views}
                                        </div>
                                    </Tooltip>
                                   
                                </div>

                                <Tabs defaultActiveKey="1" className="tabs">
                                    <TabPane tab="Description" key="1">
                                        {book?.description}
                                    </TabPane>
                                    <TabPane tab="Table of contents" key="2">
                                        <ul className="tabPane">
                                            {chapters.map((chapter, index) => (
                                                <li className="glava" key={index}>
                                                    Chapter {index + 1}: {chapter.part}
                                                </li>

                                            ))}
                                        </ul>
                                    </TabPane>
                                </Tabs>

                                <div className="detailed-buttons">
                                    <Link to={`/read/${book.name}`}>
                                        <button className="read">Read Book</button>
                                    </Link>

                                    <Dropdown menu={{ items: items2 }} placement="bottom" trigger={['click']} className="inbookmark">
                                        <button>Bookmark</button>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        <div className="detailed-comments">
                            <textarea
                                name=""
                                id=""
                                cols="10"
                                rows="2"
                                className="detailed-comments-textarea"
                                placeholder="Leave a comment about the book"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            ></textarea>
                            <div className="send-comment-container">
                                <button className="send-comment" onClick={handleCommentSubmit}>
                                    Send
                                </button>
                            </div>
                            <div className='thread'>
                                {renderComments()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DetailedPage;
