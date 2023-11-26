import Footer from '../components/Footer';
import React, { useState } from 'react';
import '../css/AddBook.css';
import axios from 'axios';
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import { Helmet } from 'react-helmet';

const AddBook = () => {
    window.scrollTo(0, 0);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        author: '',
        image: '',
        name: ''
    });

    const [showAlert, setShowAlert] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const dataToSend = new FormData();
        dataToSend.append('title', formData.title);
        dataToSend.append('description', formData.description);
        dataToSend.append('author', formData.author);
        dataToSend.append('image', formData.image);
        dataToSend.append('name', formData.name);
        dataToSend.append('views', '0');
        dataToSend.append('likes', '0');

        axios
            .post('http://hellafragilesite.com/avalanche.books.api/book-add.php', dataToSend)
            .then((response) => {
                console.log(response.data);
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                    window.location.reload(); 
                }, 1000); 
            })
            .catch((error) => {
                console.error(error);
            });
    };


    return (
        <div className='app'>
            <Helmet>
                <title>Add Books</title>
            </Helmet>
            <div className='main'>
                <div className='add-book'>
                    <form onSubmit={handleSubmit} className='forma-container'>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Название"
                            value={formData.title}
                            onChange={handleChange}
                            className='forma'
                        />

                        <input
                            type="text"
                            id="description"
                            name="description"
                            placeholder="Описание"
                            value={formData.description}
                            onChange={handleChange}
                            className='forma'
                        />

                        <input
                            type="text"
                            id="author"
                            name="author"
                            placeholder="Автор"
                            value={formData.author}
                            onChange={handleChange}
                            className='forma'
                        />

                        

                        <input
                            type="text"
                            id="image"
                            name="image"
                            placeholder="Обложка"
                            value={formData.image}
                            onChange={handleChange}
                            className='forma'
                        />

                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Скоротка"
                            value={formData.name}
                            onChange={handleChange}
                            className='forma'
                        />

                        <input type="hidden" name="views" value="0" />
                        <input type="hidden" name="likes" value="0" />
                        <Button type="submit" variant="contained" color='secondary' style={{ marginBottom: "30px" }}>
                            Добавить книгу
                        </Button>
                        {showAlert && <Alert  variant="filled">Книга успешно добавлена</Alert>}
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AddBook;
