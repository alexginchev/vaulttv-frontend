import axiosClient from './axiosClient';

export const getAllMedia = () => axiosClient.get('/media');
export const getMediaById = (id) => axiosClient.get(`/media/${id}`);

export const createMedia = (data) => axiosClient.post('/media', data);
export const updateMedia = (id, data) => axiosClient.put(`/media/${id}`, data);
export const deleteMedia = (id) => axiosClient.delete(`/media/${id}`);

export const uploadPoster = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosClient.post(`/media/${id}/poster`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadBackdrop = (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosClient.post(`/media/${id}/backdrop`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const addCastMember = (mediaId, actorId, role) =>
  axiosClient.post('/media/cast', { mediaId, actorId, role });

export const removeCastMember = (castId) =>
  axiosClient.delete(`/media/cast/${castId}`);