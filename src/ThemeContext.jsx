import React, { useState, createContext, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const bodyColor = isDarkMode ? '#1C1C1C' : '#E2E2E2';
    const wrpColor = isDarkMode ? '#757575' : '#f0f0f0';

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <style>
                {`
                :root {
                  --body-color: ${bodyColor};
                  --wrp-color: ${wrpColor};
                }
                `}
            </style>
            {children}
        </ThemeContext.Provider>
    );
};
