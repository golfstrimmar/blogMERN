import React, {createContext, useContext, useState, useEffect} from 'react';
import axios from '../API/axios';

const AuthContext = createContext();
export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Устанавливаем состояние на основе наличия токена
  }, []);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  //-------------------- Проверка, авторизован ли пользователь
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Получаем данные пользователя с сервера
      axios
        .get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data); // Сохраняем данные пользователя
        })
        .catch(() => {
          setIsAuthenticated(false); // Если не удается получить данные, сбрасываем авторизацию
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);
  //--------------------
  // const login = (token, user) => {
  //   localStorage.setItem('token', token);
  //   localStorage.setItem('user', JSON.stringify(user));
  //   setIsAuthenticated(true);
  // };
  // Функция для логина
  const login = async (email, password) => {
    try {
      console.log(email, password)
      const response = await axios.post('/auth/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const {token, userData} = response.data;
      localStorage.setItem('token', token); // Сохраняем токен в localStorage
      localStorage.setItem('user', JSON.stringify(userData)); // Сохраняем данные пользователя
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      throw new Error('Login failed');
    }
  };
  //--------------------
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };
  //--------------------
  return (
    <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
