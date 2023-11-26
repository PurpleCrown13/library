import '../css/Comments.css';
import React, { useState, useEffect } from 'react';
import SmsIcon from '@mui/icons-material/Sms';
import axios from 'axios';

const Comments = () => {
    const [comments, setComments] = useState([]);

    const fetchComments = async () => {
        try {
            const response = await axios.get('http://hellafragilesite.com/avalanche.books.api/comments_all.php');
            setComments(response.data);
        } catch (error) {
            console.error('Ошибка при получении комментариев:', error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <div className='comments'>
            <div>
                <div className='comments-title'>LATEST COMMENTS</div>
                {comments.slice(-4).map((comment, index) => (
                    <div key={index} className='comment'>
                        <div className='user-name'>
                            <SmsIcon sx={{ fontSize: 18 }} /> &nbsp; {comment.login}
                        </div>
                        <div className='user-comment'>{comment.content}</div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default Comments;

