import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterForm.css';

const AuthorizationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Состояние для ошибок и статуса загрузки
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Обработка изменений в полях
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const response = await fetch('http://localhost:5252/api/Users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при регистрации');
          }
    
          const result = await response.json();
          console.log('Успешная авторизация:', result);
          navigate('/home'); 
        } catch (err) {
          setError(err.message || 'Что-то пошло не так');
        } finally {
          setLoading(false);
        }
  };

  return (
    <div className="container-fluid">
      <div className='row'>
        <div className='col-6'>

        </div>
        <div className='col-6'>
          <div className='row align-items-center form'>
            <div className='col-3'></div>
            <form className="col-5" onSubmit={handleSubmit}>
              <h2 className='mb-3'>Авторизация</h2>
              <input 
                placeholder='Логин' 
                className='mb-2 input-text'
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required/>
              <input placeholder='Пароль'
                className='mb-2 input-text'
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}/>
                <button className="mb-2" type="submit" disabled={loading}>
                {loading ? 'Загрузка...' : 'Войти'}
              </button>
              <Link to="/register">Зарегистрироваться</Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationForm;