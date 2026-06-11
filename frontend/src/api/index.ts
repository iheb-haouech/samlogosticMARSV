import { Api } from "./myApi";

export const API_BASE_URL = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL;

const apiClient = new Api({
  //baseApiParams: {
  //headers: {
  // Authorization: `Bearer ${getAccessToken()}`,
  //},
  //},
  // base url backend
  baseUrl: `${API_BASE_URL}`,
});
export const ApiClientWithHeaders = (token: string) => {
  const myClient = new Api({
    baseApiParams: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    baseUrl: `${API_BASE_URL}`,
  });
  return myClient;
};
export { apiClient };
