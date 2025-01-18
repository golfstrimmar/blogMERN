import React, {useState, useEffect, useContext} from 'react';
import {TextField, Button, Box, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

const LoginPage = () => {
  const {login, isAuthenticated} = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Для успешного сообщения
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  // Проверяем, если пользователь уже авторизован, перенаправляем на страницу постов
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/posts');
    }
  }, [isAuthenticated, navigate]);
  // Функция для валидации формы
  const validateForm = () => {
    let isValid = true;
    let errors = {email: '', password: ''};
    // Проверка на пустоту
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is not valid';
      isValid = false;
    }
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };
  // Обработчик логина
  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    setSuccessMessage(''); // Сбрасываем предыдущее сообщение об успехе
    try {
      await login(email, password);
      setSuccessMessage('Login successful!');
      setTimeout(() => {
        navigate('/posts');
      }, 2000);
    } catch (err) {
      setError('Failed to log in');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box sx={{maxWidth: 400, margin: '0 auto', padding: 3}}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{marginBottom: 2}}
        error={!!formErrors.email}
        helperText={formErrors.email}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{marginBottom: 2}}
        error={!!formErrors.password}
        helperText={formErrors.password}
      />
      {error && <Typography color="error">{error}</Typography>}
      {successMessage && (
        <Typography color="success" sx={{marginBottom: 2, fontWeight: 'bold'}}>
          {successMessage}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
      <Box sx={{marginTop: 2}}>
        <Typography variant="body2">
          Don't have an account?{' '}
          <Button
            variant="text"
            color="primary"
            onClick={() => navigate('/register')}
          >
            Register here
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};
export default LoginPage;
