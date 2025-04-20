import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CourseStructure from "./CourseStructure";
import StepContent from "./StepContent";
import "./CourseViewPage.css";

function CourseViewPage() {
    const { courseId, stepId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        const fetchCourse = async () => {
            const userId = localStorage.getItem("userId"); // Получаем userId из LocalStorage
            try {
                const response = await fetch(
                    `http://193.37.71.67:8000/api/Courses/${courseId}${userId ? `?userId=${userId}` : ""}`,
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );
                if (!response.ok) {
                    throw new Error("Ошибка загрузки курса");
                }
                const data = await response.json();
                setCourse(data);
                setLoading(false);

                if (
                    isInitialMount.current &&
                    !stepId &&
                    data.blocks?.length > 0 &&
                    data.blocks[0].topics?.length > 0 &&
                    data.blocks[0].topics[0].steps?.length > 0
                ) {
                    navigate(`/courses/${courseId}/step/${data.blocks[0].topics[0].steps[0].id}`, { replace: true });
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchCourse();
        isInitialMount.current = false;
    }, [courseId, navigate]);

    if (loading) return <div className="text-white">Загрузка...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    return (
        <div className="d-flex min-vh-100 bg-dark">
            <CourseStructure blocks={course?.blocks} courseId={courseId} />
            <main className="flex-grow-1 p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h2 className="text-white fs-4 fw-bold m-0">{course?.title}</h2>
                    <button className="btn btn-outline-light m-0 col-2 align-self-end" onClick={() => navigate('/my-courses')}>Назад к курсам</button>
                </div>
                <StepContent blocks={course?.blocks} />
            </main>
        </div>)
}

export default CourseViewPage;