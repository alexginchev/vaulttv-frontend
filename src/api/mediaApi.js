import axiosClient from './axiosClient';

export const getAllMedia = () => axiosClient.get('/media');
export const getMediaById = (id) => axiosClient.get(`/media/${id}`);