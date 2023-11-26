import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import Footer from '../components/Footer';
import '../css/AddChapter.css';
import Alert from '@mui/material/Alert';
import { Helmet } from 'react-helmet';

const AddChapter = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState('');
    const [partName, setPartName] = useState('');
    const [chapterContent, setChapterContent] = useState('');
    const [image, setImage] = useState(''); 
    const [imageName, setImageName] = useState(''); 
    const [showAlert, setShowAlert] = useState(false);


    useEffect(() => {
        const savedSelectedBook = localStorage.getItem('selectedBook');
        if (savedSelectedBook) {
            setSelectedBook(savedSelectedBook);
        }

        axios.get('http://hellafragilesite.com/avalanche.books.api/books.php')
            .then(response => {
                const bookNames = response.data.map(book => book.name);
                setBooks(bookNames);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


    const handleBookChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedBook(selectedValue);
        localStorage.setItem('selectedBook', selectedValue);
    };

    const handlePartNameChange = (event) => {
        setPartName(event.target.value);
    };

    const handleChapterContentChange = (event) => {
        setChapterContent(event.target.value);
    };

    const handleImageChange = (event) => {
        setImage(event.target.value);
    };

    const handleImageNameChange = (event) => {
        setImageName(event.target.value);
    };


    const handleSubmit = () => {
        console.log('Selected book:', selectedBook);
        const formData = new FormData();
        formData.append('book', selectedBook);
        formData.append('part', partName);
        formData.append('chapter', chapterContent);
        formData.append('image', image); 
        formData.append('image_name', imageName); 
        axios
            .post('http://hellafragilesite.com/avalanche.books.api/savechapter.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {
                console.log('Response from server:', response);
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                    window.location.reload(); 
                }, 1000);
            })
            .catch(error => {
                console.error('Error adding chapter:', error);
            });
    };


    return (
        <div className='app'>
            <Helmet>
                <title>Add Chapter</title>
            </Helmet>
            <div className='main'>
                <div className='addchapter'>
                    <div className='chapter'>
                        <select name="" id="" className="space select-book" value={selectedBook} onChange={handleBookChange}>
                            <option value="" disabled hidden>
                                Выберите книгу
                            </option>
                            {books.map((bookName, index) => (
                                <option key={index} value={bookName}>
                                    {bookName}
                                </option>
                            ))}
                        </select>

                        <input type="text" className='space part-name' placeholder='Название главы' value={partName} onChange={handlePartNameChange} />
                        <textarea name="" id="" cols="30" rows="10" className='space chapter-content' value={chapterContent} onChange={handleChapterContentChange} placeholder='Текст главы' ></textarea>
                        <input type="text" className='space part-name' placeholder='Картинка' value={image} onChange={handleImageChange} />
                        <input type="text" className='space part-name' placeholder='Название картинки' value={imageName} onChange={handleImageNameChange} />
                        <Button type="submit" variant="contained" color='secondary' className='space' onClick={handleSubmit} style={{ marginBottom: "30px" }}>Добавить главу</Button>
                        {showAlert && <Alert variant="filled">Глава успешно добавлена</Alert>}

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AddChapter;
