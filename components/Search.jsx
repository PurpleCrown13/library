import Footer from '../components/Footer';
import React, { useState } from 'react';
import { Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import '../css/Search.css';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';


const Search = () => {
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

    const [searchTerm, setSearchTerm] = useState('');
    const [books, setBooks] = useState([]);
    const [searchMessage, setSearchMessage] = useState('');

    const handleSearch = async () => {
        if (searchTerm.trim() === '') {
            setSearchMessage('');
            return;
        }

        try {
            const response = await fetch('http://hellafragilesite.com/avalanche.books.api/books.php');
            const data = await response.json();
            const filteredBooks = data.filter(
                (book) => book.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setBooks(filteredBooks);

            if (filteredBooks.length === 0) {
                setSearchMessage('No results found.');
            } else {
                setSearchMessage('Search results:');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const incrementViewCount = async (id) => {
        try {
            await axios.post(`http://hellafragilesite.com/avalanche.books.api/update_views.php?id=${id}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='app'>
            <Helmet>
                <title>Search Books</title>
            </Helmet>
            <div className='main'>
                <div className='search'>
                    <div className='search-box-top'>
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={handleInputChange}
                            placeholder='Enter book title'
                            className='search-input'
                        />
                        <button onClick={handleSearch} className='search-btn'>
                            <SearchIcon sx={{ fontSize: 24 }} className='search-btn-icon'/>
                        </button>
                    </div>

                    {searchMessage && (
                        <Alert severity={books.length === 0 ? 'error' : 'success'} variant='filled' >
                            {searchMessage}
                        </Alert>
                    )}

                    <ul className='searched'>
                        {books.map((book) => (
                            <li key={book.id} className='searched-book'>
                                <Link
                                    to={`/detailed-page/${book.name}`}
                                    className='searched-link'
                                    onClick={() => incrementViewCount(book.id)}
                                >
                                    {book.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Search;
