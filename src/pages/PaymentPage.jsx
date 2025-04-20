"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PaymentPage() {
  const { courseId } = useParams(); // Получаем courseId из URL
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(""); // Статус оплаты

  useEffect(() => {
    // Загружаем информацию о курсе по courseId
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://193.37.71.67:8000/api/courses/${courseId}`, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Курс не найден');
        }

        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handlePayment = async () => {
    if (!course) return;

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Необходимо войти в аккаунт');
        return;
      }

      // Подготавливаем данные для отправки
      const paymentData = {
        UserId: parseInt(userId), // Преобразуем в число, если это необходимо
        CourseId: parseInt(courseId), // Преобразуем в число
        PaymentAmount: course.price || 0, // Сумма оплаты из данных курса
        PaymentStatus: "completed", // Статус оплаты (можно сделать динамическим)
      };

      // Отправляем POST-запрос на API
      const response = await fetch('http://193.37.71.67:8000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обработке оплаты');
      }

      const result = await response.json();
      setPaymentStatus('Оплата успешно завершена!');
      alert('Курс успешно приобретен!');
      navigate('/home'); // Возвращаем пользователя на главную страницу после оплаты
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="text-danger text-center py-5">{error}</div>;
  }

  if (!course) {
    return <div className="text-white text-center py-5">Загрузка...</div>;
  }

  return (
    <div className="d-flex vh-100 align-items-center">
      <div className="container py-5 w-">
        <div className="dark-gray bg-dark g-dark text-white p-4">
          <h2>Оплата курса</h2>
          <p><strong>Название курса:</strong> {course.title || "Без названия"}</p>
          <p><strong>Цена:</strong> {course.price} ₽</p>
          <p><strong>Инструктор:</strong> {course.instructor || "Не указан"}</p>

          {error && <div className="text-danger mb-3">{error}</div>}
          {paymentStatus && <div className="text-success mb-3">{paymentStatus}</div>}

          <div className="row gap-3">
            <button className="btn btn-outline-light btn-sm col" onClick={handlePayment}>
              Оплатить🤑
            </button>

            <button className="btn btn-outline-light btn-sm col" onClick={() => navigate('/home')}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;