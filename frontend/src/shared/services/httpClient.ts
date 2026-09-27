import axios from "axios";

export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

let unauthorizedHandler: (() => void) | null = null;

export function setAuthToken(token: string | null) {
    if (token) {
        httpClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete httpClient.defaults.headers.common.Authorization;
    }
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
    unauthorizedHandler = handler;
}

httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            unauthorizedHandler?.();
        }
        return Promise.reject(error);
    },
);
