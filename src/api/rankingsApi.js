import axiosClient from './axiosClient';

export const getAllRankingLists = () => axiosClient.get('/rankings');
export const getRankingListById = (id) => axiosClient.get(`/rankings/${id}`);
export const createRankingList = (data) => axiosClient.post('/rankings', data);
export const deleteRankingList = (id) => axiosClient.delete(`/rankings/${id}`);

export const addRankingEntry = (listId, data) => axiosClient.post(`/rankings/${listId}/entries`, data);
export const deleteRankingEntry = (entryId) => axiosClient.delete(`/rankings/entries/${entryId}`);

export const reorderEntries = (listId, orderedEntryIds) =>
  axiosClient.patch(`/rankings/${listId}/reorder`, { orderedEntryIds });