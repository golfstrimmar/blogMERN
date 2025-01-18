import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import AppRouter from './components/AppRouter';
import Header from './components/Header';
import {AuthProvider} from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header/>
        <AppRouter/>
      </Router>
    </AuthProvider>
  );
}

export default App;

