import '../css/Footer.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../src/ThemeContext';

const Footer = () => {
    const { isDarkMode } = useContext(ThemeContext);

    return (
        <div className={`footer ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className='booklya'>AvalancheBooks 2023</div>
            <div>
                <Link to="/about" className='about'>About</Link>
            </div>
            
        </div>
    );
};

export default Footer;
