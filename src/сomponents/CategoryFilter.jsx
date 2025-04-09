"use client"
import './CategoryFilter.css';

export function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="d-flex flex-wrap">
      {categories.map((category) => (
        <button
          key={category.categoryId}
          onClick={() => onCategoryChange(category)}
          className={`btn nav-btn col-4 ${
            activeCategory && category.categoryId === activeCategory.categoryId ? "btn-orange" : "btn-dark"
          }`}
        >
          {category.categoryName}
        </button>
      ))}
    </div>
  );
}