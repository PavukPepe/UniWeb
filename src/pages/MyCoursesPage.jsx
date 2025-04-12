"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CourseCard } from "../сomponents/CourseCard.jsx";
import MainNav from "../сomponents/MainNav.jsx";
import { SearchBar } from "../сomponents/SearchBar.jsx";
import './HomePage.css';
import { MyCourseCard } from "../сomponents/MyCourseCard.jsx";

function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const response = await fetch(`http://localhost:5252/api/Payments/?userId=${userId}`, {
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
          setIsLoading(false);
          return;
        }

        const coursePromises = enrollmentIds.map(async (courseId) => {
          try {
            const courseResponse = await fetch(
              `http://localhost:5252/api/Courses/${courseId}?userId=${userId}`,
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
      } catch (err) {
        setError(err.message);
        console.error('Ошибка:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [userId]);

  const handleCourseClick = (courseId) => {
    console.log("Переход к курсу:", courseId); // Отладка
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="d-flex min-vh-100 col">
      <MainNav />
      <main className="flex-grow-1 p-4">
        <div className="mb-4">
          <SearchBar />
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
        ) : courses.length === 0 ? (
          <div className="text-white text-center py-5">
            У вас пока нет оплаченных курсов. Оплатите курсы, чтобы они отобразились здесь.
          </div>
        ) : (
          <div className="row g-4">
            {courses.map((course) => (
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