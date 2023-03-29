import axios from "axios";

interface responseObject {
    data?: object,
    code?: number
}

const instance = axios.create({
    timeout: 1000
});

instance.interceptors.response.use((res) => res.data);
export const request = (url = "", params = {}, headers = {}) => {
    for (const [key, value] of Object.entries(headers)) {
        instance.defaults.headers.common[key] = value;
    };

    return instance({
        url,
        ...params
    })
}