"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ProfilePage.css";
import MainNav from "../сomponents/MainNav.jsx";

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [salesData, setSalesData] = useState([]); // Статистика продаж
  const [progressData, setProgressData] = useState({}); // Прогресс по курсам
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    email: "",
    phone: "",
  });

  // Получаем userId и роли из localStorage
  const userId = localStorage.getItem("userId");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const isAuthor = roles.includes("author");
  const isAdmin = roles.includes("admin");

  // Загрузка данных пользователя и сертификатов
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("Пользователь не авторизован");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5252/api/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setUserData(data);
        setCertificates(data.certificates || []);

        const { lastName, firstName, middleName } = splitFullName(data.fullName);
        setFormData({
          lastName,
          firstName,
          middleName,
          email: data.email || "",
          phone: data.phone || "Не указан",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Загрузка курсов и статистики (для авторов)
  useEffect(() => {
    if (!isAuthor || !userId) return;

    const fetchMyCoursesAndStats = async () => {
      try {
        // Загружаем курсы
        const coursesResponse = await fetch(
          `http://localhost:5252/api/courses/own?authorId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!coursesResponse.ok) {
          throw new Error(`Ошибка курсов: ${coursesResponse.status} - ${coursesResponse.statusText}`);
        }

        const coursesData = await coursesResponse.json();
        setMyCourses(coursesData);

        // Загружаем статистику продаж
        const salesResponse = await fetch(
          `http://localhost:5252/api/courses/sales?authorId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!salesResponse.ok) {
          throw new Error(`Ошибка продаж: ${salesResponse.status} - ${salesResponse.statusText}`);
        }

        const salesData = await salesResponse.json();
        setSalesData(salesData);

        // Загружаем прогресс для каждого курса
        const progressPromises = coursesData.map((course) =>
          fetch(`http://localhost:5252/api/courses/${course.id}/progress`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }).then((res) => res.json())
        );

        const progressResults = await Promise.all(progressPromises);
        const progressDataMap = {};
        coursesData.forEach((course, index) => {
          progressDataMap[course.id] = progressResults[index];
        });
        setProgressData(progressDataMap);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMyCoursesAndStats();
  }, [userId, isAuthor]);

  // Разделяем FullName на фамилию, имя и отчество
  const splitFullName = (fullName) => {
    if (!fullName) return { lastName: "", firstName: "", middleName: "" };
    const parts = fullName.trim().split(" ");
    return {
      lastName: parts[0] || "",
      firstName: parts[1] || "",
      middleName: parts[2] || "",
    };
  };

  // Обработчик изменения полей ввода
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Обработчик сохранения изменений
  const handleSave = async () => {
    try {
      const updatedUser = {
        ...userData,
        fullName: `${formData.lastName} ${formData.firstName} ${formData.middleName}`.trim(),
        email: formData.email,
        phone: formData.phone === "Не указан" ? null : formData.phone,
      };

      const response = await fetch(`http://localhost:5252/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
      }

      setUserData(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Обработчик отмены редактирования
  const handleCancel = () => {
    const { lastName, firstName, middleName } = splitFullName(userData.fullName);
    setFormData({
      lastName,
      firstName,
      middleName,
      email: userData.email || "",
      phone: userData.phone || "Не указан",
    });
    setIsEditing(false);
  };

  return (
    <div className="d-flex min-vh-100 bg-dark">
      <MainNav />
      <main className="container py-4 flex-grow-1 p-0">
        {/* Контактная информация */}
        <div className="row">
          <div className="col-8">
            <div className="d-flex justify-content-between align-items-center m-3 mt-0 ms-1">
              <h2 className="h5 m-0 fs-4 fw-bold">Контактная информация</h2>
              <div className="row w-50 gap-2">
                {!isEditing ? (
                  <button
                    className="btn btn-outline-light btn-sm me-3"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="bi bi-pencil me-1"></i> Изменить
                  </button>
                ) : (
                  <>
                    <button
                      className="btn btn-outline-light btn-sm col"
                      onClick={handleSave}
                    >
                      Сохранить
                    </button>
                    <button
                      className="btn btn-outline-light btn-sm col"
                      onClick={handleCancel}
                    >
                      Отмена
                    </button>
                  </>
                )}
              </div>
            </div>
            <div>
              {isLoading ? (
                <div className="text-white text-center py-5">Загрузка...</div>
              ) : error ? (
                <div className="text-danger text-center py-5">{error}</div>
              ) : (
                <div className="row dark-gray p-3">
                  <div className="col-md-4 text-center mb-3 mb-md-0">
                    <img
                      src={
                        userData?.profilePicture ||
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-koyrjhw89Qu9a4gBkl0hn2AD61QOwB.png"
                      }
                      alt="Фото профиля"
                      className="img-fluid rounded mb-2"
                      style={{ height: 250, width: 250 }}
                    />
                    <button className="btn btn-outline-light btn-sm mt-2">
                      <i className="bi bi-pencil me-1"></i> Изменить фото
                    </button>
                  </div>
                  <div className="col-md-8">
                    <div className="mb-3 row">
                      <label className="col-sm-3 col-form-label text-secondary">
                        Фамилия
                      </label>
                      <div className="col-sm-9 d-flex align-items-center">
                        <input
                          type="text"
                          name="lastName"
                          className="text-light"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label className="col-sm-3 col-form-label text-secondary align-items-center">
                        Имя
                      </label>
                      <div className="col-sm-9 d-flex align-items-center">
                        <input
                          type="text"
                          name="firstName"
                          className="text-light border-secondary"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label className="col-sm-3 col-form-label text-secondary">
                        Отчество
                      </label>
                      <div className="col-sm-9 d-flex align-items-center">
                        <input
                          type="text"
                          name="middleName"
                          className="text-light border-secondary"
                          value={formData.middleName}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="mb-3 row">
                      <label className="col-sm-3 col-form-label text-secondary">
                        Email
                      </label>
                      <div className="col-sm-9 d-flex align-items-center">
                        <input
                          type="email"
                          name="email"
                          className="text-light border-secondary"
                          value={formData.email}
                          onChange={handleInputChange}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-4 pe-0 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center m-3 mt-0 ms-3">
              {isAdmin ? (
                <h2 className="h5 m-0 fs-4 fw-bold">Администрирование</h2>
              ) : (
                <h2 className="h5 m-0 fs-4 fw-bold">Сертификаты</h2>
              )}
              <div className="row w-50 gap-2">
                <Link className="btn btn-outline-light btn-sm me-3" to="/">
                  Выйти <i className="bi bi-box-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
            <div className="p-3 dark-gray flex-1 overflow-y-scroll" style={{ flex: 1 }}>
              {isAdmin ? (
                <Link to="/admin" className="btn btn-outline-light w-100">
                  Перейти в панель администратора
                </Link>
              ) : isLoading ? (
                <div className="text-white text-center py-5">Загрузка...</div>
              ) : error ? (
                <div className="text-danger text-center py-5">{error}</div>
              ) : certificates.length === 0 ? (
                <div className="text-white text-center py-5">
                  Сертификаты отсутствуют
                </div>
              ) : (
                <ul className="list-group-flush ps-3">
                  {certificates.map((certificate) => (
                    <li
                      key={certificate.certificateId}
                      className="list-group-item text-light dark-gray py-2"
                    >
                      <div className="row align-items-center">
                        <i className="bi bi-file-earmark-pdf text-danger me-2 fs-5 col-1"></i>
                        <div className="col-8">
                          <div>{certificate.courseTitle || "Название курса"}</div>
                          <small className="text-secondary">
                            Выдан: {new Date(certificate.issueDate).toLocaleDateString()}
                          </small>
                          <small className="text-secondary d-block">
                            Код: {certificate.certificateCode}
                          </small>
                        </div>
                        <a
                          href={`http://localhost:5252/api/certificates/${certificate.certificateId}/pdf`}
                          className="btn btn-sm btn-link col-2"
                          download={`certificate_${certificate.certificateId}.pdf`}
                        >
                          <i className="bi bi-download"></i>
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Статистика продаж */}
        {isAuthor && (
          <div className="row">
            <div className="d-flex justify-content-between align-items-center m-3 mt-0 ms-1">
              <h2 className="h5 m-0 mt-3 fs-4 fw-bold">Статистика продаж за неделю</h2>
            </div>
            <div className="dark-gray p-3">
              {isLoading ? (
                <div className="text-white text-center py-5">Загрузка...</div>
              ) : error ? (
                <div className="text-danger text-center py-5">{error}</div>
              ) : salesData.length === 0 ? (
                <div className="text-white text-center my-3">Нет продаж за неделю</div>
              ) : (
                <div className="row">
                  {salesData.map((sale) => (
                    <div key={sale.courseId} className="col-md-4 m-0 p-1">
                      <div className="p-3 card-background text-light border-secondary">
                        <div className="card-body">
                          <h6 className="card-title">{sale.courseTitle}</h6>
                          <p className="card-text">Продано: {sale.salesCount}</p>
                            <p className="card-text">Выручка: {sale.totalRevenue} ₽</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Курсы созданные мной */}
        {isAuthor && (
          <div className="mb-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 m-3 ms-1 fs-4 fw-bold">Курсы созданные мной</h2>
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
                  <div className="col text-white d-flex align-items-center m-0 justify-content-center">
                    Вы ещё не создали курсы
                  </div>
                ) : (
                  myCourses.map((course) => (
                    <div key={course.id} className="col m-0 p-1">
                      <div className="card card-background text-light border-secondary h-100">
                        <img
                          src={course.image || "/placeholder.svg?height=150&width=250"}
                          className="card-img-top object-fit-cover"
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
                            <span>{course.students || 0}</span>
                          </li>
                          <li className="list-group-item text-light border-secondary d-flex justify-content-between">
                            <span className="text-secondary">Рейтинг:</span>
                            <span>
                              {course.rating || 0}{" "}
                              <i className="bi bi-star-fill text-warning"></i>
                            </span>
                          </li>
                          <li className="list-group-item text-light border-secondary d-flex justify-content-between">
                            <span className="text-secondary">Статус:</span>
                            <span>{course.status ? "Согласован" : "На согласовании"}</span>
                          </li>
                          <li className="list-group-item text-light border-secondary">
                            <span className="text-secondary">Средний прогресс:</span>
                            <div className="progress mt-1">
                              <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${progressData[course.id]?.averageProgress || 0}%` }}
                                aria-valuenow={progressData[course.id]?.averageProgress || 0}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              >
                                {progressData[course.id]?.averageProgress || 0}%
                              </div>
                            </div>
                          </li>
                          <li className="list-group-item text-light border-secondary d-flex justify-content-between">
                            <span className="text-secondary">Завершено студентами:</span>
                            <span>{progressData[course.id]?.completedCount || 0}</span>
                          </li>
                        </ul>
                        <div className="card-footer border-secondary my-2">
                          <div className="d-grid gap-2">
                            <Link
                              to={`/coursebuilder/${course.id}`}
                              className="btn btn-outline-light btn-sm"
                            >
                              <i className="bi bi-pencil me-1"></i> Редактировать
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;