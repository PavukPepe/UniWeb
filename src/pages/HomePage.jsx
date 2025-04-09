"use client"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CourseCard } from "../сomponents/CourseCard.jsx";
import MainNav from "../сomponents/MainNav.jsx";
import { SearchBar } from "../сomponents/SearchBar.jsx";
import { CategoryFilter } from "../сomponents/CategoryFilter.jsx";
import './HomePage.css';

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5252/api/categories', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Ошибка при загрузке категорий');
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setActiveCategory(data[0]); // Устанавливаем первую категорию как активную
        } else {
          setError("Категории не найдены");
          setIsLoading(false);
        }
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeCategory) return;

    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:5252/api/courses?categoryId=${activeCategory.categoryId}`,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (!response.ok) throw new Error(`Ошибка при загрузке курсов: ${response.statusText}`);
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="d-flex min-vh-100 col">
      <MainNav />
      <main className="flex-grow-1 p-4">
        <div className="mb-4">
          <SearchBar />
        </div>

        <div className="mb-4">
          {categories.length > 0 ? (
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          ) : (
            <div className="text-white text-center">Категории не найдены</div>
          )}
        </div>

        {error ? (
          <div className="text-danger text-center py-5">{error}</div>
        ) : isLoading ? (
          <div className="text-white text-center py-5">Загрузка...</div>
        ) : courses.length === 0 ? (
          <div className="text-white text-center py-5">
            В категории "{activeCategory?.categoryName}" курсы не найдены
          </div>
        ) : (
          <div className="row g-4">
            {courses.map((course) => (
              <div key={course.courseId} className="col-12 col-md-6 col-lg-4">
                <CourseCard course={course} onClick={() => handleCourseClick(course.courseId)} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;