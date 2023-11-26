import Footer from '../components/Footer';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const About = () => {
    const navigate = useNavigate();
    const login = useSelector((state) => state.auth.login); 

    useEffect(() => {
        if (!login) {
            navigate('/login'); 
        }
    }, [navigate, login]);

    window.scrollTo(0, 0);

    return (
        <div className='app'>
            <Helmet>
                <title>About</title>
            </Helmet>
            <div className='main'>
                <div className='about-site'>
                    The site was created not for commercial book distribution. All books just for example.
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;
