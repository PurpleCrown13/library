import Footer from '../components/Footer';
import React, { useState, useEffect } from 'react';
import '../css/Read.css';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SyncLoader from 'react-spinners/SyncLoader';
import { Drawer } from 'antd';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Slider from '@mui/material/Slider';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

const Read = () => {
    const [data, setData] = useState(null); 
    const { name } = useParams();
    const [dataLength, setDataLength] = useState(0); 
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState('left');
    const [parts, setParts] = useState([]);
    const [openSettings, setOpenSettings] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(() => {
        const savedIndex = localStorage.getItem('currentIndex_' + name);
        return savedIndex ? parseInt(savedIndex) : 0;
    });

    const [fontSize, setFontSize] = useState(3); 

    const handleSettingsClick = () => {
        setOpenSettings(true);
    };

    const handleCloseSettings = () => {
        setOpenSettings(false);
    };

    const handleFontSizeChange = (event, value) => {
        setFontSize(value);
        localStorage.setItem('fontSize', value.toString()); 
    };

    const [selectedChapterIndex, setSelectedChapterIndex] = useState(currentIndex);

    useEffect(() => {
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            setFontSize(parseInt(savedFontSize));
        }
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://hellafragilesite.com/avalanche.books.api/read.php?name=${name}`);
                const responseData = response.data;

                if (responseData.length === 0) {
                    setData(null);
                    setDataLength(0);
                } else {
                    setData(responseData[currentIndex]);
                    setDataLength(responseData.length);
                    setParts(responseData.map(item => item.part)); 
                }
                console.log(responseData);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [currentIndex, name]);

    useEffect(() => {
        setSelectedChapterIndex(currentIndex);
        localStorage.setItem('currentIndex_' + name, currentIndex);
    }, [currentIndex, name]);

    useEffect(() => {
        window.scrollTo(0, 0); 
    }, [currentIndex, name]);

    const handleDrawerItemClick = (index) => {
        setCurrentIndex(index);
        setSelectedChapterIndex(index);
        setOpen(false); 
    };


    if (!data) {
        return (
            <div className='loader'>
                <SyncLoader color='#A57AEB' />
            </div>
        );
    }

    return (
        <div className='app'>
            <Helmet>
                <title>{data.part}</title>
            </Helmet>
            <div className='main'>
                <div className='read-page'>
                    <div className='buttons-top'>
                        <div className='links-top'>
                            <Link to={`/detailed-page/${name}`} className='links-top'>
                                <MenuBookIcon sx={{ fontSize: 18 }} />
                                &nbsp;Return to book page
                            </Link>
                        </div>
                        <div className='links-top' onClick={handleSettingsClick}>
                            <SettingsApplicationsIcon sx={{ fontSize: 18 }} />
                            &nbsp;Settings
                        </div>
                        <Dialog open={openSettings} onClose={handleCloseSettings} fullWidth>
                            <DialogContent>
                                <p className='settings-title'>Settings</p>
                                <p className='settings'>
                                    <TextIncreaseIcon sx={{ fontSize: 18 }} />&nbsp; Text size:
                                    <Slider
                                        value={fontSize}
                                        min={1}
                                        max={5}
                                        size='medium'
                                        color='secondary'
                                        marks
                                        onChange={handleFontSizeChange}
                                    />
                                   
                                    
                                </p>
                            </DialogContent>
                            <DialogActions>
                                <Button color='secondary' onClick={handleCloseSettings}>
                                    CLOSE
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div className='buttons-top'>
                        {currentIndex > 0 ? (
                            <button className='button-top' onClick={() => setCurrentIndex(prevIndex => prevIndex - 1)}>
                                🠔🠔 Previous Chapter
                            </button>
                        ) : (
                                <button className='hollow'>🠔🠔 Previous Chapter</button>
                        )}
                        <button type='primary' onClick={() => setOpen(true)} className='button-top'>
                            Table of contents

                        </button>
                        
                        {currentIndex < dataLength - 1 ? (
                            <button className='button-top' onClick={() => setCurrentIndex(prevIndex => prevIndex + 1)}>
                                Next Chapter 🠖🠖
                            </button>
                        ) : (
                                <button className='hollow'>Next Chapter 🠖🠖</button>
                        )}
                    </div>
                    <div className='text-container-box'>
                        <div className='text-container'>
                            <h1 className='part'>{data.part}</h1>
                            <div
                                className='chapter-read'
                                style={{ fontSize: `${fontSize * 2 + 12}px` }} 
                            >
                                {data.chapter.split('\n').map((paragraph, index) => (
                                    <p key={index} style={{ textIndent: '2em' }}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <img src={data.image} alt="" className='book-dlc-image' />
                    <div className='book-dlc-image-name'>
                            {data.image_name}
                    </div>
                    <div className='buttons-top'>
                        {currentIndex > 0 ? (
                            <button className='button-top' onClick={() => setCurrentIndex(prevIndex => prevIndex - 1)}>
                                🠔🠔 Previous Chapter
                            </button>
                        ) : (
                                <button className='hollow'>🠔🠔 Previous Chapter</button>
                        )}
                        <button type='primary' onClick={() => setOpen(true)} className='button-top'>
                            Table of contents
                        </button>
                        <Drawer
                            placement={placement}
                            closable={false}
                            onClose={() => setOpen(false)}
                            open={open}
                            key={placement}
                            width='600'
                            style={{ backgroundColor: 'var(--body-color)' }}
                        >
                            <div className='drawer-wrp'>
                                {parts.map((part, index) => (
                                    <p
                                        key={index}
                                        className={`drawer ${selectedChapterIndex === index ? 'selected-chapter' : ''}`}
                                        onClick={() => handleDrawerItemClick(index)}
                                    >
                                        Chapter {index + 1}: {part}
                                    </p>
                                ))}

                            </div>
                        </Drawer>
                        {currentIndex < dataLength - 1 ? (
                            <button className='button-top' onClick={() => setCurrentIndex(prevIndex => prevIndex + 1)}>
                                Next Chapter 🠖🠖
                            </button>
                        ) : (
                            <button className='hollow'>Next Chapter 🠖🠖</button>
                        )}
                    </div>
                    <div className='text' style={{ fontSize: `${fontSize * 2 + 12}px` }}>{data.text}</div> 
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Read;
