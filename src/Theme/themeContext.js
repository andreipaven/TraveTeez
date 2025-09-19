// ThemeContext.js
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './customTheme';

const ThemeContext = createContext(lightTheme);

export const ThemeProvider = ({ children }) => {
    const scheme = useColorScheme(); // 'light' sau 'dark'
    const theme = scheme === 'dark' ? darkTheme : lightTheme;

    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};


export const useTheme = () => useContext(ThemeContext);
