import Footer from '../components/Footer'
import * as React from 'react';
import '../css/News.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

const News = () => {

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

    window.scrollTo(0, 0);

    <Helmet>
        <title>News</title>
    </Helmet>

    return (
        
        <div className='app'>
            <Helmet>
                <title>News</title>
            </Helmet>
            <div className='main'>
                <div className='news-container'>
                    <div className='news'>
                        <div className='news-title'> 10 August 2023</div>
                        <div className='news-content'>Added version for 1400px width.</div>
                    </div>
                    <div className='news'>
                        <div className='news-title'> 7 August 2023</div>
                        <div className='news-content'>Modified login to the site using Redux.</div>
                    </div>
                    <div className='news'>
                        <div className='news-title'> 6 August 2023</div>
                        <div className='news-content'>Now the chapters have a number, the current chapter is highlighted, added memorization of the choice when adding a book, added the ability to add a picture to the chapter.</div>
                    </div>
                    <div className='news'>
                        <div className='news-title'> 4 August 2023</div>
                        <div className='news-content'> Site development completed.</div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default News;