// Client
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Types

// Constants
import { API_URL } from '@/utils/constants';

const instance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

const responseBody = (response: AxiosResponse) => response.data;

export const APIService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getLocation: (id: string): Promise<any> =>
    instance.get(`/locations/${id}`).then(responseBody),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMap: (id: string): Promise<any> => instance.get(`/map/${id}`).then(responseBody),
};
