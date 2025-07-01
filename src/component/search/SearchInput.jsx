// SearchInput.jsx
import React from 'react';

const SearchInput = ({ searchTerm, setSearchTerm, onFilterClick }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="장소, 액티비티 등을 검색하세요"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="filter-btn" onClick={onFilterClick}>
        필터
      </button>
    </div>
  );
};

export default SearchInput;
