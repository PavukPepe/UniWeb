"use client"
import { useState } from 'react';
import './SearchBar.css';

export function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    return (
        <div className="d-flex align-items-center searcher p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6c757d"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="search"
            className="text-white ms-2"
            placeholder="Поиск по курсам"
            value={query}
            onChange={handleInputChange}
          />
        </div>
    )
}