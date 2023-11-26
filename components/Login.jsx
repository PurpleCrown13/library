import React, { useState } from 'react';
import Footer from '../components/Footer';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import '../css/LogReg.css';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser } from '../redux/actions/authActions';

const Login = () => {
    const dispatch = useDispatch();
    
    const auth = useSelector(state => state.auth);
    const history = useNavigate();

    const [formData, setFormData] = useState({
        login: '',
        pass: '',
    });

    const [showAlert, setShowAlert] = useState(false);
    const [showEmptyAlert, setShowEmptyAlert] = useState(false);
    const [showInvalidAlert, setShowInvalidAlert] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.login === '' || formData.pass === '') {
            setShowEmptyAlert(true);
            setTimeout(() => {
                setShowEmptyAlert(false);
            }, 2000);
            return;
        }

        const dataToSend = {
            login: formData.login,
            pass: formData.pass,
        };

        try {
            const response = await axios.post('http://hellafragilesite.com/avalanche.books.api/book-login.php', dataToSend);

            console.log(response.data);

            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);

                dispatch(loginUser(formData.login));

                history('/user');
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error(error);

            setShowInvalidAlert(true);
            setTimeout(() => {
                setShowInvalidAlert(false);
            }, 2000);
        }
    };



    return (
        <div className='app'>
            <div className='main'>
                <div className='add-book'>
                    <form onSubmit={handleSubmit} className='forma-container'>
                        <input
                            type='text'
                            id='login'
                            name='login'
                            placeholder='Login'
                            value={formData.login}
                            onChange={handleChange}
                            className='forma'
                        />

                        <input
                            type='password'
                            id='pass'
                            name='pass'
                            placeholder='Password'
                            value={formData.pass}
                            onChange={handleChange}
                            className='forma'
                        />
                        <Button
                            type='submit'
                            variant='contained'
                            color='warning'
                            style={{ marginBottom: '30px' }}
                            className='log-button'
                        >
                            Sign in
                        </Button>
                        {showAlert && (
                            <Alert severity='success' variant='filled'>
                                You have successfully signed in
                            </Alert>
                        )}
                        {showEmptyAlert && (
                            <Alert severity='info' variant='filled'>
                                Username and password cannot be empty
                            </Alert>
                        )}
                        {showInvalidAlert && (
                            <Alert severity='error' variant='filled'>
                                Please enter correct login or password
                            </Alert>
                        )}

                        <Link to={`/register`} style={{ paddingTop: '10px' }} className='linkto'>
                            Register
                        </Link>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
