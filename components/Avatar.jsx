import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Avatar = ({ src }) => {
    console.log('Avatar src:', src);
    return src ? <img src={src} alt="User Avatar" className="mini-avatar" /> : <AccountCircleIcon sx={{ fontSize: 40 }} className="icon" />;
};


export default Avatar;
