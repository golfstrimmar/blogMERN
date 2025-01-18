import React, {useState, useEffect} from 'react';
import {TextField, Button, Box, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import axios from '../API/axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Для успешной регистрации
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    password: ''
  });
  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      navigate('/posts'); // Перенаправляем на страницу постов, если пользователь уже авторизован
    }
  }, [navigate]);
  const validateForm = () => {
    let isValid = true;
    let errors = {username: '', email: '', password: ''};
    if (!username) {
      errors.username = 'Username is required';
      isValid = false;
    }
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
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    setSuccessMessage('');
    console.log('Form data:', {fullName: username, email, password});
    try {
      const response = await axios.post('/auth/register', {
        fullName: username,
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const {data} = response;
      localStorage.setItem('user', JSON.stringify(data));
      setSuccessMessage('Registration successful!');
      setTimeout(() => {
        navigate('/posts');
      }, 2000);
    } catch (err) {
      setError('Failed to register user');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box sx={{maxWidth: 400, margin: '0 auto', padding: 3}}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{marginBottom: 2}}
        error={!!formErrors.username}
        helperText={formErrors.username}
      />
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
      {successMessage && (
        <Typography color="success" sx={{marginBottom: 2, fontWeight: 'bold'}}>
          {successMessage}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </Box>
  );
};
export default RegisterPage;
