"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CourseCard } from "../сomponents/CourseCard.jsx";
import MainNav from "../сomponents/MainNav.jsx";
import { SearchBar } from "../сomponents/SearchBar.jsx";
import { MyCourseCard } from "../сomponents/MyCourseCard.jsx";
import './HomePage.css';

function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      setIsLoading(true);
      setError(null);

      if (!userId) {
        setError('Необходимо войти в аккаунт');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://193.37.71.67:8000/api/Payments/?userId=${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке оплаченных курсов');
        }

        const enrollmentIds = await response.json();
        if (enrollmentIds.length === 0) {
          setCourses([]);
          setFilteredCourses([]);
          setIsLoading(false);
          return;
        }

        const coursePromises = enrollmentIds.map(async (courseId) => {
          try {
            const courseResponse = await fetch(
              `http://193.37.71.67:8000/api/Courses/${courseId}?userId=${userId}`,
              { headers: { 'Content-Type': 'application/json' } }
            );
            if (!courseResponse.ok) {
              console.error(`Ошибка загрузки курса ${courseId}`);
              return null;
            }
            const data = await courseResponse.json();
            console.log(`Курс ${courseId}:`, data); // Отладка
            return data;
          } catch (err) {
            console.error(`Ошибка загрузки курса ${courseId}:`, err);
            return null;
          }
        });

        const enrolledCourses = (await Promise.all(coursePromises)).filter(Boolean);
        console.log("Все загруженные курсы:", enrolledCourses); // Отладка
        setCourses(enrolledCourses);
        setFilteredCourses(enrolledCourses);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [userId]);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const handleCourseClick = (courseId) => {
    console.log("Переход к курсу:", courseId); // Отладка
    navigate(`/courses/${courseId}`);
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
          <h2 className="text-white m-0 fs-4 fw-bold">Мои курсы</h2>
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
              : `У вас пока нет оплаченных курсов. Оплатите курсы, чтобы они отобразились здесь.`}
          </div>
        ) : (
          <div className="row g-4">
            {filteredCourses.map((course) => (
              <div key={course.id} className="col-12 col-md-6 col-lg-4">
                <MyCourseCard course={course} onClick={() => handleCourseClick(course.id)} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyCoursesPage;