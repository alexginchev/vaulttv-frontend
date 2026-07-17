import axiosClient from './axiosClient';

export const getAllActors = () => axiosClient.get('/actors');
export const createActor = (data) => axiosClient.post('/actors', data);