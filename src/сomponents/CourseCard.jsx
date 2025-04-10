import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './CourseCard.css';

export function CourseCard({ course, onClick }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);

  // Получаем userId из localStorage
  const userId = localStorage.getItem('userId');

  // Загружаем избранные курсы при монтировании
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
        // Удаляем из избранного
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
        // Добавляем в избранное
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

  return (
    <div className="card card-background text-white h-100" style={{ overflow: "hidden" }} onClick={onClick}>
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
          <p className="card-title col d-flex justify-content-end">{course.price + " ₽" || "Бесплатно"}</p>
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
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "2px" }}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            ))}
          <span className="text-secondary ms-1 small">/{course.reviewCount || 0} отзывов</span>
        </div>

        <div className="text-secondary mb-3">{course.instructor || "Инструктор не указан"}</div>

        <div className="d-flex align-items-center gap-2">
          <Link to={`/enroll/${course.courseId}`} className="btn btn-orange">
            Записаться
          </Link>

          <Link to={`/course/${course.courseId}`} className="text-white text-decoration-none">
            Программа курса
          </Link>
        </div>
      </div>
    </div>
  );
}