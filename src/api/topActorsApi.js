import axiosClient from './axiosClient';

export const getTop10 = () => axiosClient.get('/topactors');
export const setActorRank = (actorId, rank) => axiosClient.put('/topactors/rank', { actorId, rank });
export const clearActorRank = (actorId) => axiosClient.put('/topactors/clear', { actorId });