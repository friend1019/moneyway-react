import React from 'react';

const CategorySelector = ({ category, setCategory, categories }) => {
  return (
    <div className="category-buttons">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`category-btn ${cat === category ? 'active' : ''}`}
          onClick={() => setCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
