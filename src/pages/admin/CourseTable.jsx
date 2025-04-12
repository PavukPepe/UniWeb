import { useState, useEffect } from "react";

function CoursesTable() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5252/api/courses', {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`Ошибка при загрузке курсов: ${response.statusText}`);
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleApproval = async (course) => {
    const updatedCourse = { ...course, IsApproved: !course.IsApproved };
    try {
      const response = await fetch(`http://localhost:5252/api/courses/approved/${course.courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCourse),
      });

      if (!response.ok) throw new Error(`Не удалось ${updatedCourse.IsApproved ? 'одобрить' : 'отклонить'} курс`);
      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="table-responsive">
      {error ? (
        <div className="text-danger text-center py-5">{error}</div>
      ) : isLoading ? (
        <div className="text-dark text-center py-5">Загрузка...</div>
      ) : courses.length === 0 ? (
        <div className="text-dark text-center py-5">Курсы не найдены</div>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="thead-dark bg-dark text-white">
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Описание</th>
              <th>Категория</th>
              <th>Одобрен</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.courseId}>
                <td>{course.courseId}</td>
                <td>{course.title || "Без названия"}</td>
                <td>{course.description || "Описание отсутствует"}</td>
                <td>{course.category || "Без категории"}</td>
                <td>{course.isApproved ? 'Да' : 'Нет'}</td>
                <td>
                  <button 
                    className={`btn btn-sm ${course.isApproved ? 'btn-danger' : 'btn-success'}`} 
                    onClick={() => handleToggleApproval(course)}
                  >
                    {course.isApproved ? 'Отклонить' : 'Одобрить'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CoursesTable;