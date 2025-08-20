import apiClient from './apiClient';
import { User } from '../../types/user';

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/users');
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await apiClient.get<User>(`/users/${id}`);
  return response.data;
};
