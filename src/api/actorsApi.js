import axiosClient from './axiosClient';

export const getActors = (params) => axiosClient.get('/actors', { params });
export const getActorById = (id) => axiosClient.get(`/actors/${id}`);
export const createActor = (data) => axiosClient.post('/actors', data);
export const updateActor = (id, data) => axiosClient.put(`/actors/${id}`, data);
export const deleteActor = (id) => axiosClient.delete(`/actors/${id}`);
export const importActors = (actors) => axiosClient.post('/actors/import', { actors });