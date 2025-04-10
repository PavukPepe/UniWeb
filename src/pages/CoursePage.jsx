"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronDown, ChevronUp } from "react-bootstrap-icons"
import ReactMarkdown from 'react-markdown' // Добавляем импорт
import MainNav from "../сomponents/MainNav.jsx"

export default function CoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('CoursePage mounted with courseId:', courseId);
    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Fetching course from:', `http://localhost:5252/api/courses/${courseId}`);
        const response = await fetch(`http://localhost:5252/api/courses/${courseId}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Course data received:', data);
        const blocksWithExpanded = data.blocks && data.blocks.length > 0
          ? data.blocks.map(block => ({
              ...block,
              expanded: false,
              topics: block.topics && block.topics.length > 0
                ? block.topics.map(topic => ({
                    ...topic,
                    expanded: false
                  }))
                : []
            }))
          : [];
        setCourse({ ...data, blocks: blocksWithExpanded });
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
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

  if (isLoading) return <div className="text-white text-center py-5">Загрузка курса...</div>;
  if (error) return <div className="text-danger text-center py-5">{error}</div>;
  if (!course || !course.blocks) return <div className="text-white text-center py-5">Курс не найден или пуст</div>;

  return (
    <div className="d-flex min-vh-100 bg-dark">
      <MainNav />
      <main className="flex-grow-1 p-4 row">       
        <div className="col-8">
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
                <div key={block.id} className="bg-dark border-secondary mb-3">
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
                      <div className="list-group list-group-flush bg-dark">
                        {block.topics.map((topic) => (
                          <div key={topic.id} className="list-group-item bg-dark border-secondary text-white">
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
                              <ul className="list-group list-group-flush mt-2 bg-dark">
                                {topic.steps.map((step) => (
                                  <li
                                    key={step.id}
                                    className="list-group-item bg-dark border-secondary d-flex align-items-center"
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
          <img src="" alt="" style={{ height:400, width: 400}}/>
        </div>
      </main>
    </div>
  );
}