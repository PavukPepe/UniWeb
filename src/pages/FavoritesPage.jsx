"use client"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CourseCard } from "../сomponents/CourseCard.jsx";
import MainNav from "../сomponents/MainNav.jsx";
import { SearchBar } from "../сomponents/SearchBar.jsx";
import './HomePage.css';

function FavoritesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Получаем userId из localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchFavoriteCourses = async () => {
      setIsLoading(true);
      setError(null);

      if (!userId) {
        setError('Необходимо войти в аккаунт');
        setIsLoading(false);
        return;
      }

      try {
        // Получаем список избранных курсов с сервера
        const response = await fetch(`http://localhost:5252/api/wishlists?userId=${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке избранных');
        }

        const wishlistIds = await response.json();
        if (wishlistIds.length === 0) {
          setCourses([]);
          setIsLoading(false);
          return;
        }

        // Запрашиваем данные о курсах
        const coursesResponse = await fetch('http://localhost:5252/api/courses', {
          headers: { 'Content-Type': 'application/json' },
        });

        if (!coursesResponse.ok) throw new Error('Ошибка при загрузке курсов');

        const allCourses = await coursesResponse.json();
        const favoriteCourses = allCourses.filter(course => wishlistIds.includes(course.courseId));
        setCourses(favoriteCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteCourses();
  }, [userId]);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="d-flex min-vh-100 col">
      <MainNav />
      <main className="flex-grow-1 p-4">
        <div className="mb-4">
          <SearchBar />
        </div>

        <div className="mb-4">
          <h2 className="text-white">Избранные курсы</h2>
        </div>

        {error ? (
          <div className="text-danger text-center py-5">{error}</div>
        ) : isLoading ? (
          <div className="text-white text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-white text-center py-5">
            У вас пока нет избранных курсов. Добавьте курсы в избранное, чтобы они отобразились здесь.
          </div>
        ) : (
          <div className="row g-4">
            {courses.map((course) => (
              <div key={course.courseId} className="col-12 col-md-6 col-lg-4">
                <CourseCard course={course} onClick={() => handleCourseClick(course.courseId)} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default FavoritesPage;