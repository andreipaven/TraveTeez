import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Save token
export const saveToken = async (key, value) => {
    await SecureStore.setItemAsync(key, value);
};

// Get token
export const getToken = async (key) => {
    return await SecureStore.getItemAsync(key);
};

// Delete token
export const deleteToken = async (key) => {
    await SecureStore.deleteItemAsync(key);
};

// Shortcuts
export const saveAccessToken = (token) => saveToken(ACCESS_TOKEN_KEY, token);
export const getAccessToken = () => getToken(ACCESS_TOKEN_KEY);
export const deleteAccessToken = () => deleteToken(ACCESS_TOKEN_KEY);

export const saveRefreshToken = (token) => saveToken(REFRESH_TOKEN_KEY, token);
export const getRefreshToken = () => getToken(REFRESH_TOKEN_KEY);
export const deleteRefreshToken = () => deleteToken(REFRESH_TOKEN_KEY);
