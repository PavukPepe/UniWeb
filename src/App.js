import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './сomponents/RegisterForm';
import AuthorizationForm from './сomponents/AuthorizationForm';
import './App.css';

function App() {
  return (
<Router>
      <div className="App" style={{ height: '100vh' }}>
        <Routes>
          <Route path="/" element={<AuthorizationForm />} /> {/* Главная страница — авторизация */}
          <Route path="/register" element={<RegisterForm />} /> {/* Страница регистрации */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;