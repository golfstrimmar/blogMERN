import axios from 'axios';
// Указываем базовый URL нашего бэкенда
const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`, // Адрес бэкенда
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export default instance;
// ${process.env.REACT_APP_API_URL}