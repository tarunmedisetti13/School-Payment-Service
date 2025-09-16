import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api", // your backend
});

export default api;
