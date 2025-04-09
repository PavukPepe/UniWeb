"use client"

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ProfilePage.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import MainNav from "../сomponents/MainNav.jsx";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Регистрация компонентов Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

// Моковые данные для общей статистики (оставим пока)
const lineChartData = {
  labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  datasets: [
    {
      label: "Посещения",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

const barChartData = {
  labels: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
  datasets: [
    {
      label: "Активные пользователи",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const doughnutChartData = {
  labels: ["Завершили", "В процессе", "Не начали"],
  datasets: [
    {
      label: "Прогресс студентов",
      data: [300, 50, 100],
      backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(255, 99, 132, 0.6)"],
      borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)", "rgba(255, 99, 132, 1)"],
      borderWidth: 1,
    },
  ],
};

function ProfilePage() {
  const [myCourses, setMyCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка курсов пользователя с API
  useEffect(() => {
    const fetchMyCourses = async () => {
      const userId = localStorage.getItem('userId'); // Получаем ID пользователя
      if (!userId) {
        setError("Пользователь не авторизован");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5252/api/courses/own?authorId=${userId}`, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setMyCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="d-flex min-vh-100 bg-dark">
      <MainNav />
      <main className="container py-4 flex-grow-1 p-0">
        {/* Контактная информация */}
        <div className="row">
          <div className="col-8">
            <div>
              <h2 className="h5 m-3 mt-0 ms-1">Контактная информация</h2>
            </div>
            <div>
              <div className="row dark-gray p-3">
                <div className="col-md-4 text-center mb-3 mb-md-0">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-koyrjhw89Qu9a4gBkl0hn2AD61QOwB.png"
                    alt="Фото профиля"
                    className="img-fluid rounded"
                    style={{ maxHeight: "200px" }}
                  />
                  <button className="btn btn-outline-light btn-sm mt-2">
                    <i className="bi bi-pencil me-1"></i> Изменить фото
                  </button>
                </div>
                <div className="col-md-8">
                  <div className="mb-3 row">
                    <label className="col-sm-3 col-form-label text-secondary">Фамилия</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control text-light"
                        value="Пилькевич"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label className="col-sm-3 col-form-label text-secondary">Имя</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control text-light border-secondary"
                        value="Сергей"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label className="col-sm-3 col-form-label text-secondary">Отчество</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control text-light border-secondary"
                        value="Сергеевич"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label className="col-sm-3 col-form-label text-secondary">Email</label>
                    <div className="col-sm-9">
                      <input
                        type="email"
                        className="form-control text-light border-secondary"
                        value="spiderman@example.com"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <label className="col-sm-3 col-form-label text-secondary">Телефон</label>
                    <div className="col-sm-9">
                      <input
                        type="tel"
                        className="form-control text-light border-secondary"
                        value="+7 (999) 123-45-67"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4 pe-0 d-flex flex-column">
            <div style={{ flex: 0 }}>
              <h2 className="h5 m-3 mt-0 ms-3">Сертификаты</h2>
            </div>
            <div className="p-3 dark-gray flex-1" style={{ flex: 1 }}>
              <ul className="list-group-flush ps-3">
                {[1, 2, 3].map((item) => (
                  <li key={item} className="list-group-item text-light dark-gray py-2">
                    <div className="row align-items-center">
                      <i className="bi bi-file-earmark-pdf text-danger me-2 fs-5 col-1"></i>
                      <div className="col-6">
                        <div>Вход в IT от PDD</div>
                        <small className="text-secondary">Выдан: 15.03.2023</small>
                      </div>
                      <button className="btn btn-sm btn-link ms-auto col-3">
                        <i className="bi bi-download"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="btn w-100">
                <i className="bi bi-plus me-1"></i> Загрузить сертификат
              </button>
            </div>
          </div>
        </div>

        {/* Курсы созданные мной */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h5 m-3 ms-1">Курсы созданные мной</h2>
          </div>

          {isLoading ? (
            <div className="text-white text-center py-5">Загрузка курсов...</div>
          ) : error ? (
            <div className="text-danger text-center py-5">{error}</div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 dark-gray g-4 p-3">
              <div className="col m-0 p-1">
                <Link to="/coursebuilder">
                  <button className="h-100 add-btn">+</button>
                </Link>
              </div>
              {myCourses.length === 0 ? (
                <div className="col-12 text-white text-center">Вы ещё не создали курсы</div>
              ) : (
                myCourses.map((course) => (
                  <div key={course.id} className="col m-0 p-1">
                    <div className="card card-background text-light border-secondary h-100">
                      <img
                        src={course.image || "/placeholder.svg?height=150&width=250"}
                        className="card-img-top"
                        alt={course.title}
                        style={{ maxHeight: "200px" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{course.title}</h5>
                        <p className="card-text small description">{course.description}</p>
                      </div>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item text-light border-secondary d-flex justify-content-between">
                          <span className="text-secondary">Студентов:</span>
                          <span>{course.students}</span>
                        </li>
                        <li className="list-group-item text-light border-secondary d-flex justify-content-between">
                          <span className="text-secondary">Рейтинг:</span>
                          <span>
                            {course.rating} <i className="bi bi-star-fill text-warning"></i>
                          </span>
                        </li>
                        {/* <li className="list-group-item text-light border-secondary">
                          <span className="text-secondary d-block mb-1">Прогресс:</span>
                          <div className="progress bg-secondary">
                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{ width: `${course.progress}%` }}
                              aria-valuenow={course.progress}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              {course.progress}%
                            </div>
                          </div>
                        </li> */}
                      </ul>
                      <div className="card-footer border-secondary">
                        <div className="d-grid gap-2">
                          <button className="btn btn-outline-light btn-sm">
                            <i className="bi bi-pencil me-1"></i> Редактировать
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Статистика */}
        <div>
          <h2 className="h5 mb-4">Статистика</h2>

          {/* Общая статистика */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card text-light border-secondary mb-4">
                <div className="card-header border-secondary">
                  <h3 className="h6 mb-0">Посещаемость за неделю</h3>
                </div>
                <div className="card-body">
                  <Line
                    data={lineChartData}
                    options={{
                      responsive: true,
                      plugins: { legend: { labels: { color: "#fff" } } },
                      scales: {
                        x: { ticks: { color: "#adb5bd" }, grid: { color: "#2c3034" } },
                        y: { ticks: { color: "#adb5bd" }, grid: { color: "#2c3034" } },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-light border-secondary mb-4">
                <div className="card-header border-secondary">
                  <h3 className="h6 mb-0">Активность по месяцам</h3>
                </div>
                <div className="card-body">
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      plugins: { legend: { labels: { color: "#fff" } } },
                      scales: {
                        x: { ticks: { color: "#adb5bd" }, grid: { color: "#2c3034" } },
                        y: { ticks: { color: "#adb5bd" }, grid: { color: "#2c3034" } },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-light border-secondary mb-4">
                <div className="card-header border-secondary">
                  <h3 className="h6 mb-0">Прогресс студентов</h3>
                </div>
                <div className="card-body">
                  <Doughnut
                    data={doughnutChartData}
                    options={{
                      responsive: true,
                      plugins: { legend: { labels: { color: "#fff" } } },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Статистика по курсам пока оставим как есть */}
          <h3 className="h6 mb-3">Статистика по курсам</h3>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {/* Здесь можно позже добавить динамическую статистику */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;