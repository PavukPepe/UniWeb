import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './pages/RegisterForm';
import AuthorizationForm from './pages/AuthorizationForm';
import HomePage from './pages/HomePage';
import DevBlog from './pages/DevBlog';
import MyCoursesPage from './pages/MyCoursesPage';
import './App.css';
import PaymentPage from "./pages/PaymentPage";
import CourseBuilder from './pages/CourseBilder';
import ProfilePage from './pages/ProfilePage';
import CoursePage from './pages/CoursePage';
import FavoritesPage from "./pages/FavoritesPage.jsx";
import CourseViewPage from "./pages/CourseViewPage";
import AdminDashboard from './pages/admin/AdminDashboard.jsx';


function App() {
  return (
<Router>
      <div className="App" style={{ height: '100vh' }}>
        <Routes>
          <Route path="/" element={<AuthorizationForm />} /> {/* Главная страница — авторизация */}
          <Route path="/register" element={<RegisterForm />} /> {/* Страница регистрации */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/coursebuilder" element={<CourseBuilder />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/blog" element={<DevBlog />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/payment/:courseId" element={<PaymentPage />} />
          <Route path="/coursebuilder" element={<CourseBuilder />} />
          <Route path="/coursebuilder/:id" element={<CourseBuilder />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/courses/:courseId" element={<CourseViewPage />} />
          <Route path="/courses/:courseId/step/:stepId" element={<CourseViewPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;