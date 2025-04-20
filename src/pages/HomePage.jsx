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
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://193.37.71.67:8000/api/categories', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Ошибка при загрузке категорий');
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setActiveCategory(data[0]);
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
          `http://193.37.71.67:8000/api/courses?categoryId=${activeCategory.categoryId}`,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (!response.ok) throw new Error(`Ошибка при загрузке курсов: ${response.statusText}`);
        const data = await response.json();
        const approvedCourses = data.filter(course => course.isApproved === true);
        setCourses(approvedCourses);
        setFilteredCourses(approvedCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [activeCategory]);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchQuery(""); // Clear search when changing category
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="d-flex min-vh-100 col">
      <MainNav />
      <main className="flex-grow-1 p-4">
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="mb-4 align-items-center justify-content-center d-flex">
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
        ) : filteredCourses.length === 0 ? (
          <div className="text-white text-center py-5">
            {searchQuery
              ? `Курсы по запросу "${searchQuery}" не найдены`
              : `В категории "${activeCategory?.categoryName}" курсы не найдены`}
          </div>
        ) : (
          <div className="row g-4">
            {filteredCourses.map((course) => (
              <div key={course.courseId} className="col-12 col-md-6 col-lg-4">
                <CourseCard course={course} onDoubleClick={() => handleCourseClick(course.courseId)} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;