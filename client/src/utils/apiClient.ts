import axios from 'axios';

const client = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const GET = async <T>(endpoint: string) => {
    const response = await client.get<T>(endpoint);
    return response.data;
};

export const POST = async <T>(endpoint: string, data: unknown) => {
    const response = await client.post<T>(endpoint, data);
    return response.data;
};

export const PATCH = async <T>(endpoint: string, data: unknown) => {
    const response = await client.patch<T>(endpoint, data);
    return response.data;
};

export const DELETE = async <T>(endpoint: string) => {
    const response = await client.delete<T>(endpoint);
    return response.data;
};