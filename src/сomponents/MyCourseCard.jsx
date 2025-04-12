"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './CourseCard.css';

export function MyCourseCard({ course, onDoubleClick }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchWishlists = async () => {
      if (!userId) {
        setError('Необходимо войти в аккаунт');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5252/api/wishlists?userId=${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке избранных');
        }

        const wishlistIds = await response.json();
        setIsFavorite(wishlistIds.includes(course.courseId));
      } catch (err) {
        setError(err.message);
        console.error('Ошибка при загрузке избранных:', err);
      }
    };
    fetchWishlists();
  }, [course.courseId, userId]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    setError(null);

    if (!userId) {
      setError('Необходимо войти в аккаунт');
      return;
    }

    try {
      if (isFavorite) {
        const response = await fetch(`http://localhost:5252/api/wishlists/${course.courseId}?userId=${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Ошибка при удалении из избранного');
        }

        setIsFavorite(false);
      } else {
        const response = await fetch('http://localhost:5252/api/wishlists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, courseId: course.courseId }),
        });

        if (!response.ok) {
          throw new Error('Ошибка при добавлении в избранное');
        }

        setIsFavorite(true);
      }
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при обновлении избранного:', err);
    }
  };

  // Вычисляем прогресс
  const allSteps = course.blocks
    ?.flatMap((block) => block.topics)
    .flatMap((topic) => topic.steps) || [];
  const completedSteps = allSteps.filter((step) => step.completed).length;
  const totalSteps = allSteps.length;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="card card-background text-white h-100" style={{ overflow: "hidden" }} onDoubleClick={onDoubleClick}>
      <div className="position-relative" style={{ height: "180px" }}>
        <img src='course.png' alt={course.title || "Без названия"} className="w-100 h-100 object-fit-cover" />
        <i
          onClick={toggleFavorite}
          className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'} position-absolute top-0 end-0 m-2 p-1 favorite-btn`}
          style={{ color: isFavorite ? '#FF3800' : 'white', fontSize: '1.2rem', cursor: 'pointer' }}
        ></i>
      </div>

      <div className="card-body">
        {error && (
          <div className="text-danger small mb-2">{error}</div>
        )}
        <div className="row d-flex">
          <p className="card-title col">{course.title || "Без названия"}</p>
          <p className="card-title col d-flex justify-content-end"></p>
        </div>
        <div className="d-flex align-items-center mb-2">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={i < (course.rating || 0) ? "#FF3800" : "#495057"}
                stroke="transparent"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "2px" }}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            ))}
          <span className="text-secondary ms-1 small">/{course.review || 0} отзывов</span>
        </div>

        {/* Прогресс-бар */}
        <div className="mb-3">
          <div className="progress" style={{ height: "8px" }}>
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${progressPercentage}%` }}
              aria-valuenow={progressPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div className="text-secondary small mt-1">
            Прогресс: {completedSteps}/{totalSteps} шагов ({progressPercentage}%)
          </div>
        </div>

        <div className="text-secondary mb-3">{course.instructor || "Инструктор не указан"}</div>
        <Link to={`/courses/${course.id}`} className="w-100 btn btn-orange">
          Продолжить
        </Link>
      </div>
    </div>
  );
}