import '../css/Comments.css';
import React from 'react';
import { Link } from 'react-router-dom';

const NewsPreview = () => {


    return (
        <div className='comments'>
            <div>
                <div className='comments-title'>LATEST NEWS</div>
                <div className='comment'>
                    <div className='user-name'> 10 August 2023</div>
                    <div className='user-comment'>Added version for 1400px width.</div>
                </div>
                <Link to="/news" className='all-news'>All news</Link>

            </div>
        </div>
    );
};

export default NewsPreview;
