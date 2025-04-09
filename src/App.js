import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './pages/RegisterForm';
import AuthorizationForm from './pages/AuthorizationForm';
import HomePage from './pages/HomePage';
import DevBlog from './pages/DevBlog';
import MyCourses from './pages/MyCourses';
import './App.css';
import CourseBuilder from './pages/CourseBilder';
import ProfilePage from './pages/ProfilePage';
import CoursePage from './pages/CoursePage';

function App() {
  return (
<Router>
      <div className="App" style={{ height: '100vh' }}>
        <Routes>
          <Route path="/" element={<AuthorizationForm />} /> {/* Главная страница — авторизация */}
          <Route path="/register" element={<RegisterForm />} /> {/* Страница регистрации */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/coursebuilder" element={<CourseBuilder />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/blog" element={<DevBlog />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/coursebuilder" element={<CourseBuilder />} />
          <Route path="/coursebuilder/:id" element={<CourseBuilder />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;