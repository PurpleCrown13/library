import Footer from '../components/Footer';
import React, { useState } from 'react';
import '../css/AddBook.css';
import axios from 'axios';
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import { Link, useNavigate } from 'react-router-dom';
import '../css/LogReg.css';

const Register = () => {
    const history = useNavigate();
    window.scrollTo(0, 0);

    const [formData, setFormData] = useState({
        login: '',
        pass: '',
        avatar: 'avatars/admin_man-svgrepo-com.svg',
    });

    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (value.length <= 40) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const dataToSend = new FormData();
        dataToSend.append('login', formData.login);
        dataToSend.append('pass', formData.pass);
        dataToSend.append('avatar', formData.avatar);

        axios
            .post('http://hellafragilesite.com/avalanche.books.api/book-register.php', dataToSend)
            .then((response) => {
                console.log(response.data);
                if (response.status === 200 && response.data.message === 'User added successfully') {
                    setShowAlert(true);
                    setTimeout(() => {
                        setShowAlert(false);
                        history('/login');
                    }, 1000);
                }
            })
            .catch((error) => {
                console.error(error);
                if (error.response && error.response.status === 400) {
                    setErrorMessage('This login already exists. Try other.');
                } else {
                    setErrorMessage('An error occurred while registering. Please try again later.');
                }
            });
    };


    const isFormValid = formData.login !== '' && formData.pass !== '';

    return (
        <div className='app'>
            <div className='main'>
                <div className='add-book'>
                    <form onSubmit={handleSubmit} className='forma-container'>
                        <input
                            type='text'
                            id='login'
                            name='login'
                            placeholder='Login (up to 40 characters)'
                            value={formData.login}
                            onChange={handleChange}
                            className='forma'
                            maxLength={40}
                        />

                        <input
                            type='password'
                            id='pass'
                            name='pass'
                            placeholder='Password (up to 40 characters)'
                            value={formData.pass}
                            onChange={handleChange}
                            className='forma'
                            maxLength={40}
                        />
                        <Button
                            type='submit'
                            variant='contained'
                            color='secondary'
                            style={{ marginBottom: '30px' }}
                            disabled={!isFormValid}
                            className='log-button'

                        >
                            Register
                        </Button>
                        {errorMessage && (
                            <Alert variant='filled' severity='error'>
                                {errorMessage}
                            </Alert>
                        )}
                        {showAlert && (
                            <Alert variant='filled' style={{marginTop: "20px"}}>You have successfully registered</Alert>
                        )}

                        <Link to='/login' style={{ paddingTop: '10px' }} className='linkto'>
                            Sign to your account
                        </Link>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
