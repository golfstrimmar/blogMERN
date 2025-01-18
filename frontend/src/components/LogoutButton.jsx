import React from 'react';
import {Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Удаляем токен и данные пользователя из localStorage
    localStorage.removeItem('token');  // Если вы храните токен
    localStorage.removeItem('user');   // Если вы храните данные пользователя
    navigate('/login');  // Перенаправляем на страницу логина
  };
  return (
    <Button
      variant="outlined"
      color="white"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};
export default LogoutButton;
