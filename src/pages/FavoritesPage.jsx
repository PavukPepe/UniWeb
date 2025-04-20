"use client"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CourseCard } from "../сomponents/CourseCard.jsx";
import MainNav from "../сomponents/MainNav.jsx";
import { SearchBar } from "../сomponents/SearchBar.jsx";
import './HomePage.css';

function FavoritesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
        const response = await fetch(`http://193.37.71.67:8000/api/wishlists?userId=${userId}`, {
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
          setFilteredCourses([]);
          setIsLoading(false);
          return;
        }

        // Запрашиваем данные о курсах
        const coursesResponse = await fetch('http://193.37.71.67:8000/api/courses', {
          headers: { 'Content-Type': 'application/json' },
        });

        if (!coursesResponse.ok) throw new Error('Ошибка при загрузке курсов');

        const allCourses = await coursesResponse.json();
        const favoriteCourses = allCourses.filter(course => wishlistIds.includes(course.courseId));
        setCourses(favoriteCourses);
        setFilteredCourses(favoriteCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteCourses();
  }, [userId]);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="d-flex min-vh-100 col">
      <MainNav />
      <main className="flex-grow-1 p-4">
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="mb-4">
          <h2 className="m-0 fs-4 fw-bold">Избранные курсы</h2>
        </div>

        {error ? (
          <div className="text-danger text-center py-5">{error}</div>
        ) : isLoading ? (
          <div className="text-white text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-white text-center py-5">
            {searchQuery
              ? `Курсы по запросу "${searchQuery}" не найдены`
              : `У вас пока нет избранных курсов. Добавьте курсы в избранное, чтобы они отобразились здесь.`}
          </div>
        ) : (
          <div className="row g-4">
            {filteredCourses.map((course) => (
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