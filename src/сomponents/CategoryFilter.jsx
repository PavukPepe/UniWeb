"use client"
import './CategoryFilter.css';

export function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="d-flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category)}
          className={`btn nav-btn ${category.id === activeCategory.id ? "btn-orange" : "btn-dark"}`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

