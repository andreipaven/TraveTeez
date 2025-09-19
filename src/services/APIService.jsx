// APIService.js
import axios from 'axios';
import {config} from "./config";

const http = axios.create({
    baseURL: config.legacyBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});


export default class APIService {
    static get(endpoint, config = {}) {
        return http.get(endpoint, config);
    }

    static post(endpoint, data, config = {}) {
        return http.post(endpoint, data, config);
    }
}