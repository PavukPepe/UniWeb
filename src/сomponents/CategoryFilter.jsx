"use client"
import './CategoryFilter.css';

export function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="d-flex flex-wrap row w-100 gap-3 align-items-center justify-content-center">
      {categories.map((category) => (
        <button
          key={category.categoryId}
          onClick={() => onCategoryChange(category)}
          className={`btn nav-btn col ${
            activeCategory && category.categoryId === activeCategory.categoryId ? "btn-orange" : "btn-dark"
          }`}
        >
          {category.categoryName}
        </button>
      ))}
    </div>
  );
}