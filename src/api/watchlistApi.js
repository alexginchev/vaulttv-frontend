import axiosClient from './axiosClient';

export const getMyWatchlist = () => axiosClient.get('/watchlist');
export const addToWatchlist = (mediaId) => axiosClient.post('/watchlist', { mediaId });
export const removeFromWatchlist = (mediaId) => axiosClient.delete(`/watchlist/${mediaId}`);