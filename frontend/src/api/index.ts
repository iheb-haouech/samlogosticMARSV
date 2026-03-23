import { Api } from "./myApi";

const apiClient = new Api({
  //baseApiParams: {
  //headers: {
  // Authorization: `Bearer ${getAccessToken()}`,
  //},
  //},
  // base url backend
  baseUrl: `${import.meta.env.VITE_BASE_URL}`,
});
export const ApiClientWithHeaders = (token: string) => {
  const myClient = new Api({
    baseApiParams: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    baseUrl: `${import.meta.env.VITE_BASE_URL}`,
  });
  return myClient;
};
export { apiClient };
