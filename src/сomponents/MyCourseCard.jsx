"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './CourseCard.css';

export function MyCourseCard({ course, onDoubleClick }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [certificateGenerated, setCertificateGenerated] = useState(false); // Флаг, что сертификат уже создан

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchWishlists = async () => {
      if (!userId) {
        setError('Необходимо войти в аккаунт');
        return;
      }

      try {
        const response = await fetch(`http://193.37.71.67:8000/api/wishlists?userId=${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}` // Добавляем токен
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

    // Проверяем, существует ли сертификат для этого курса
    const checkCertificate = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`http://193.37.71.67:8000/api/certificates?userId=${userId}&courseId=${course.courseId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          },
        });

        if (response.ok) {
          const certificates = await response.json();
          setCertificateGenerated(certificates.length > 0); // Если сертификат есть, устанавливаем флаг
        }
      } catch (err) {
        console.error('Ошибка при проверке сертификата:', err);
      }
    };

    fetchWishlists();
    checkCertificate();
  }, [course.courseId, userId]);

  // Вычисляем прогресс
  const allSteps = course.blocks
    ?.flatMap((block) => block.topics)
    .flatMap((topic) => topic.steps) || [];
  const completedSteps = allSteps.filter((step) => step.completed).length;
  const totalSteps = allSteps.length;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Обработчик для получения сертификата
  const handleGetCertificate = async () => {
    if (!userId) {
      setError('Необходимо войти в аккаунт');
      return;
    }

    try {
      const certificate = {
        userId: parseInt(userId),
        courseId: course.id,
        issueDate: new Date().toISOString(),
        certificateCode: `CERT-${course.id}-${userId}-${Date.now()}` // Генерируем уникальный код
      };

      const response = await fetch('http://193.37.71.67:8000/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(certificate),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Не удалось создать сертификат');
      }

      setCertificateGenerated(true); // Устанавливаем флаг, что сертификат создан
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при создании сертификата:', err);
    }
  };

  return (
    <div className="card card-background text-white h-100" style={{ overflow: "hidden" }} onDoubleClick={onDoubleClick}>
      <div className="position-relative" style={{ height: "180px" }}>
        <img src={course.logo || "/course.png"}
  alt={course.title || "Без названия"} className="w-100 h-100 object-fit-cover" />
      </div>

      <div className="card-body">
        {error && (
          <div className="text-danger small mb-2">{error}</div>
        )}
        <div className="row d-flex">
          <p className="card-title col">{course.title || "Без названия"}</p>
          <p className="card-title col d-flex justify-content-end"></p>
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

        {/* Кнопка "Продолжить" или "Получить сертификат" */}
        {progressPercentage === 100 && !certificateGenerated ? (
          <button 
            className="w-100 btn btn-success"
            onClick={handleGetCertificate}
          >
            Получить сертификат
          </button>
        ) : (
          <Link to={`/courses/${course.id}`} className="w-100 btn btn-orange">
            Продолжить
          </Link>
        )}
      </div>
    </div>
  );
}