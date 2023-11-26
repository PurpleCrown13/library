import Footer from '../components/Footer'
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/About.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../css/User.css';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SyncLoader from "react-spinners/SyncLoader";
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actions/authActions'; 

const User = () => {
    const navigate = useNavigate();
    const login = useSelector((state) => state.auth.login); 
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!login) {
            navigate('/login');
        }
    }, [navigate, login]);

    const dispatch = useDispatch();


    if (!login) {
        return null;
    }
    
    const history = useNavigate();
    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
        window.location.reload();
    };


    const [avatar, setAvatar] = useState(null);

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleAvatarUpload = () => {
        const formData = new FormData();
        formData.append('avatar', avatar);

        formData.append('login', login);

        axios.post('http://hellafragilesite.com/avalanche.books.api/upload_avatar.php', formData).then((response) => {
            console.log(response.data);
            window.location.reload(); 
        });
    };

    useEffect(() => {
        axios.get(`http://hellafragilesite.com/avalanche.books.api/get_avatar.php?login=${login}`)
            .then((response) => {
                setAvatar(response.data.avatar);
            });
    }, []);

    const [bookmarks, setBookmarks] = useState({
        reading: [],
        inThePlans: [],
        finished: [],
        readLater: [],
        abandoned: [],
    });

    useEffect(() => {
        axios
            .get(`http://hellafragilesite.com/avalanche.books.api/get_bookmarks.php?login=${login}`)
            .then((response) => {
                const data = response.data;

                const organizedBookmarks = {
                    reading: data.filter((bookmark) => bookmark.type === 'reading'),
                    inThePlans: data.filter((bookmark) => bookmark.type === 'intheplans'),
                    finished: data.filter((bookmark) => bookmark.type === 'finished'),
                    readLater: data.filter((bookmark) => bookmark.type === 'readlater'),
                    abandoned: data.filter((bookmark) => bookmark.type === 'abandoned'),
                };

                setBookmarks(organizedBookmarks);
                setLoading(false); 
            })
            .catch((error) => {
                console.error('Error fetching bookmarks:', error);
                setLoading(false); 
            });
            }, [login]);

    const handleDeleteBookmark = (bookmarkId) => {
        axios
            .delete(`http://hellafragilesite.com/avalanche.books.api/delete_bookmark.php?id=${bookmarkId}`)
            .then((response) => {
                setBookmarks((prevBookmarks) => {
                    const updatedBookmarks = { ...prevBookmarks };
                    Object.keys(updatedBookmarks).forEach((type) => {
                        updatedBookmarks[type] = updatedBookmarks[type].filter((bookmark) => bookmark.id !== bookmarkId);
                    });
                    return updatedBookmarks;
                });

                window.location.reload();
            })
            .catch((error) => {
                console.error('Error deleting bookmark:', error);
            });
    };


    return (
        <div className='app'>
            <Helmet>
                <title>User settings</title>
            </Helmet>
            <div className='main'>

                <div className='user-settings'>

                    <h1 className='hi'>
                        {localStorage.getItem('login')} Bookmarks
                    </h1>


                    {loading ? (
                        <div className='loader'>
                             <SyncLoader color="#A57AEB" />
                        </div>
                    ) : (
                            
                    <div className='user-bookmarks'>

                        {Object.values(bookmarks).every((bookmarkArr) => bookmarkArr.length === 0) && (
                            <p className='sry'>Sorry, you don't have any bookmarks.</p>
                        )}

                        {bookmarks.reading.length > 0 && (
                            <table className='GeneratedTable'>
                                <thead>
                                    <tr>
                                        <th>READING</th>
                                        <th>DELETE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookmarks.reading.map((bookmark) => (
                                        <tr key={bookmark.id}>
                                            <td>
                                                <Link to={`/detailed-page/${bookmark.name}`} className='bookmark-link'>
                                                    {bookmark.title}
                                                </Link>
                                            </td>
                                            <td className='delete-bookmark' onClick={() => handleDeleteBookmark(bookmark.id)}>
                                                <img src='trash.svg' alt='' />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {bookmarks.inThePlans.length > 0 && (
                            <table className='GeneratedTable'>
                                <thead>
                                    <tr>
                                        <th>IN THE PLANS</th>
                                        <th>DELETE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookmarks.inThePlans.map((bookmark) => (
                                        <tr key={bookmark.id}>
                                            <td>
                                                <Link to={`/detailed-page/${bookmark.name}`} className='bookmark-link'>
                                                    {bookmark.title}
                                                </Link>
                                            </td>
                                            <td className='delete-bookmark' onClick={() => handleDeleteBookmark(bookmark.id)}>
                                                <img src='trash.svg' alt='' />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {bookmarks.finished.length > 0 && (
                            <table className='GeneratedTable'>
                                <thead>
                                    <tr>
                                        <th>FINISHED</th>
                                        <th>DELETE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookmarks.finished.map((bookmark) => (
                                        <tr key={bookmark.id}>
                                            <td>
                                            <Link to={`/detailed-page/${bookmark.name}`} className='bookmark-link'>
                                                {bookmark.title}
                                            </Link>
                                            </td>
                                            <td className='delete-bookmark' onClick={() => handleDeleteBookmark(bookmark.id)}>
                                                <img src='trash.svg' alt='' />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {bookmarks.readLater.length > 0 && (
                            <table className='GeneratedTable'>
                                <thead>
                                    <tr>
                                        <th>READ LATER</th>
                                        <th>DELETE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookmarks.readLater.map((bookmark) => (
                                        <tr key={bookmark.id}>
                                            <td>
                                                <Link to={`/detailed-page/${bookmark.name}`} className='bookmark-link'>
                                                    {bookmark.title}
                                                </Link>
                                            </td>
                                            <td className='delete-bookmark' onClick={() => handleDeleteBookmark(bookmark.id)}>
                                                <img src='trash.svg' alt='' />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {bookmarks.abandoned.length > 0 && (
                            <table className='GeneratedTable'>
                                <thead>
                                    <tr>
                                        <th>ABANDONED</th>
                                        <th>DELETE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookmarks.abandoned.map((bookmark) => (
                                        <tr key={bookmark.id}>
                                            <td>
                                                <Link to={`/detailed-page/${bookmark.name}`} className='bookmark-link'>
                                                    {bookmark.title}
                                                </Link>
                                            </td>
                                            <td className='delete-bookmark' onClick={() => handleDeleteBookmark(bookmark.id)}>
                                                <img src='trash.svg' alt='' />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                    </div>
                    )}
                    <h1 className='hi'>
                        Change avatar for  {localStorage.getItem('login')}
                    </h1>

                    <input type='file' accept='image/*' onChange={handleAvatarChange} className='choose'/>
                    <Button
                        onClick={handleAvatarUpload}
                        color='success'
                        variant='contained'
                    >
                        Upload Avatar</Button>
                    <h1 className='hi'>
                        Your Avatar:
                    </h1>
                    {avatar && <img src={avatar} alt='' className='big-avatar' />}
                    
                    <Button
                        type='submit'
                        variant='contained'
                        color='error'
                        onClick={handleLogout}
                        style={{marginBottom: "50px"}}
                    >
                        Sign Out
                    </Button>

                    
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default User;
