import axiosClient from './axiosClient';

export const login = (username, password) =>
  axiosClient.post('/auth/login', { username, password });

export const register = (username, email, password) =>
  axiosClient.post('/auth/register', { username, email, password });