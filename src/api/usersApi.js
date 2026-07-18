import axiosClient from './axiosClient';

export const getMyProfile = () => axiosClient.get('/users/me');
export const updateMyProfile = (data) => axiosClient.put('/users/me', data);
export const changePassword = (data) => axiosClient.put('/users/me/password', data);

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosClient.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};