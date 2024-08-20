import axios from "axios";

export const api = axios.create({
  baseURL: "http://5.78.114.20:3333", // URL do backend
});
