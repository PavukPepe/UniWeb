"use client"

import { useState, useEffect } from "react"
import { CourseCard } from "../сomponents/CourseCard.jsx"
import MainNav from "../сomponents/MainNav.jsx"
import { SearchBar } from "../сomponents/SearchBar.jsx"
import { CategoryFilter } from "../сomponents/CategoryFilter.jsx"
import './HomePage.css';

function HomePage() {
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch categories
  useEffect(() => {
    // Simulating API call
    const fetchCategories = () => {
      // This would be replaced with actual API call
      const data = [
        { id: 1, name: "Программирование" },
        { id: 2, name: "Дизайн" },
        { id: 3, name: "Маркетинг" },
      ]
      setCategories(data)
      setActiveCategory(data[0])
    }

    fetchCategories()
  }, [])

  // Fetch courses
  useEffect(() => {
    if (!activeCategory) return

    // Simulating API call
    const fetchCourses = () => {
      setIsLoading(true)
      // This would be replaced with actual API call
      setTimeout(() => {
        const data = Array(8)
          .fill(null)
          .map((_, i) => ({
            id: i + 1,
            title: "Программирование на C#. Вводный курс",
            rating: 4,
            reviewCount: 16,
            instructor: "Иванов И. И.",
            image: "/placeholder.jpg",
            category: activeCategory.id,
          }))
        setCourses(data)
        setIsLoading(false)
      }, 500)
    }

    fetchCourses()
  }, [activeCategory])

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
  }

  return (
    <div className="d-flex min-vh-100 col">
      <MainNav />
      <main className="flex-grow-1 p-4">
        <div className="mb-4">
          <SearchBar />
        </div>

        <div className="mb-4">
          {activeCategory && (
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          )}
        </div>

        {isLoading ? (
          <div className="text-white text-center py-5">Загрузка курсов...</div>
        ) : (
          <div className="row g-4">
            {courses.map((course) => (
              <div key={course.id} className="col-12 col-md-6 col-lg-4">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default HomePage

