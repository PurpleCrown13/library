import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Main from '../components/Main';
import Comments from '../components/Comments';
import Footer from '../components/Footer';
import * as React from 'react';
import NewsPreview from './NewsPreview';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

const Home = () => {
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className='app'>
            <Helmet>
                <title>AvalancheBooks</title>
            </Helmet>
            <div className='main'>
                <Main />
                <div>
                    <Comments />
                    <NewsPreview />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
