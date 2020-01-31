import axios from 'axios';

const req = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
});

req.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default req;

