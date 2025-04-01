import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    isAuthor: false
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5252/api/Users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          isAuthor: formData.isAuthor
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при регистрации');
      }

      const result = await response.json();
      console.log('Успешная регистрация:', result);
      navigate('/'); // Редирект на авторизацию
    } catch (err) {
      setError(err.message || 'Что-то пошло не так');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-6"></div>
        <div className="col-6">
          <div className="row align-items-center form">
            <div className="col-3"></div>
            <form className="col-5" onSubmit={handleSubmit}>
              <h2 className="mb-3">Регистрация</h2>
              {error && <p className="error-text mb-2">{error}</p>}
              <input
                placeholder="Email"
                className="mb-2 input-text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <input
                placeholder="Полное имя"
                className="mb-2 input-text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <input
                placeholder="Пароль"
                className="mb-2 input-text"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <input
                placeholder="Повторите пароль"
                className="mb-2 input-text"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <div className="mb-2 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isAuthor"
                  name="isAuthor"
                  checked={formData.isAuthor}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label className="form-check-label" htmlFor="isAuthor">
                  Зарегистрироваться как автор
                </label>
              </div>
              <button className="mb-2" type="submit" disabled={loading}>
                {loading ? 'Загрузка...' : 'Зарегистрироваться'}
              </button>
              <Link to="/">Вход</Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;