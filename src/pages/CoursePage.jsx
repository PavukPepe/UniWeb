"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronDown, ChevronUp } from "react-bootstrap-icons"
import ReactMarkdown from 'react-markdown'
import MainNav from "../сomponents/MainNav.jsx"

export default function CoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ text: "", rating: 0 }); // Добавляем рейтинг
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CoursePage mounted with courseId:', courseId);
    const fetchCourseData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const courseResponse = await fetch(`http://localhost:5252/api/courses/${courseId}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!courseResponse.ok) {
          throw new Error(`Ошибка: ${courseResponse.status} - ${courseResponse.statusText}`);
        }
        const courseData = await courseResponse.json();

        const blocksWithExpanded = courseData.blocks.map(block => ({
          ...block,
          expanded: false,
          topics: block.topics.map(topic => ({
            ...topic,
            expanded: false
          }))
        }));

        setCourse({
          ...courseData,
          blocks: blocksWithExpanded
        });

        // Отдельный запрос для отзывов
        const reviewsResponse = await fetch(`http://localhost:5252/api/reviews/course/${courseId}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!reviewsResponse.ok) {
          throw new Error(`Ошибка при загрузке отзывов: ${reviewsResponse.status} - ${reviewsResponse.statusText}`);
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  const toggleModule = (blockId) => {
    setCourse(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId ? { ...block, expanded: !block.expanded } : block
      )
    }));
  };

  const toggleTopic = (blockId, topicId) => {
    setCourse(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => {
        if (block.id === blockId) {
          return {
            ...block,
            topics: block.topics.map(topic =>
              topic.id === topicId ? { ...topic, expanded: !topic.expanded } : topic
            )
          };
        }
        return block;
      })
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.text.trim()) return;

    try {
      const response = await fetch(`http://localhost:5252/api/reviews/course/${courseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText: newReview.text, // Соответствует ReviewText в модели
          userRating: newReview.rating || 0, // Рейтинг по умолчанию 0
          userName: "Anonymous" // Можно убрать, если используется UserId
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка при отправке отзыва: ${response.status} - ${response.statusText}`);
      }

      const newReviewData = await response.json();
      setReviews([...reviews, newReviewData]);
      setNewReview({ text: "", rating: 0 }); // Сбрасываем форму
    } catch (err) {
      setError(err.message);
      console.error('Error submitting review:', err);
    }
  };

  if (isLoading) return <div className="text-white text-center py-5">Загрузка курса...</div>;
  if (error) return <div className="text-danger text-center py-5">{error}</div>;
  if (!course) return <div className="text-white text-center py-5">Курс не найден или пуст</div>;

  return (
    <div className="d-flex min-vh-100 bg-dark">
      <MainNav />
      <main className="flex-grow-1 p-4 row m-0">
        <div className="col-8 dark-gray mb-3 p-3">
          <div className="container m-0 p-0">
            <button className="btn btn-outline-light mb-3 col-2" onClick={() => navigate('/home')}>Назад</button>
            <h1 className="text-white mb-4 fw-bold">{course.title}</h1>
            <div className="text-light mb-4">
              <ReactMarkdown>{course.description}</ReactMarkdown>
            </div>

            {course.blocks.length === 0 ? (
              <div className="text-white text-center">Нет модулей для отображения</div>
            ) : (
              course.blocks.map((block) => (
                <div key={block.id} className="border-secondary mb-3">
                  <div
                    className="card-header d-flex justify-content-between align-items-center mb-2"
                    onClick={() => toggleModule(block.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <h5 className="mb-0">
                      Модуль {block.id}: {block.title}
                    </h5>
                    {block.expanded ? <ChevronUp /> : <ChevronDown />}
                  </div>

                  {block.expanded && (
                    <div className="card-body text-white">
                      <div className="list-group list-group-flush">
                        {block.topics.map((topic) => (
                          <div key={topic.id} className="list-group-item border-secondary text-white">
                            <div
                              className="d-flex justify-content-between align-items-center"
                              onClick={() => toggleTopic(block.id, topic.id)}
                              style={{ cursor: "pointer" }}
                            >
                              <h6 className="mb-0">
                                Тема {topic.id}: {topic.title}
                              </h6>
                              {topic.expanded ? <ChevronUp /> : <ChevronDown />}
                            </div>

                            {topic.expanded && (
                              <ul className="list-group list-group-flush mt-2">
                                {topic.steps.map((step) => (
                                  <li
                                    key={step.id}
                                    className="list-group-item border-secondary d-flex align-items-center"
                                  >
                                    <div
                                      className={`me-2 rounded-circle border ${step.completed ? "bg-success" : ""}`}
                                      style={{ width: "12px", height: "12px" }}
                                    ></div>
                                    <span className="text-white">
                                      Шаг {step.id}: {step.title}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <div className="col-4">
          <img src={course.logo} className="dark-gray" alt="" style={{ height: 400, width: 400 }} />
        </div>
          <div className="m-0 p-0">
            <h5 className="text-white mb-3">Отзывы</h5>
            {reviews.length === 0 ? (
              <p className="col-8 p-3 dark-gray">Отзывов нет</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="col-8 p-3 dark-gray border-secondary mb-2 p-2 text-white rounded ">
                  <p>{review.text}</p>
                  <small className="">Рейтинг: {review.rating || 0}/5 - {review.userName}, {new Date(review.date).toLocaleDateString()}</small>
                </div>
              ))
            )}
            {/* Форма для добавления отзыва */}
            <form onSubmit={handleSubmitReview} className="mt-3 col-8 p-3 dark-gray">
              <div className="mb-3">
                <textarea
                  className="form-control bg-dark text-white"
                  placeholder="Оставьте ваш отзыв..."
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  rows="3"
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label text-white">Рейтинг (0-5):</label>
                <input
                  type="number"
                  className="form-control bg-dark text-white"
                  min="0"
                  max="5"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) || 0 })}
                  placeholder="Оценка"
                />
              </div>
              <button type="submit" className="btn btn-outline-light">Отправить отзыв</button>
            </form>
          </div>
      </main>
    </div>
  );
}