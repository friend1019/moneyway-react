import React from 'react';
import '../../css/search/FilterModal.css';

const categoryOptions = {
    식당: ['한식', '일식', '중식', '양식'],
    관광지: ['전시회', '자연경관'],
    카페: [],
    액티비티: [],
    숙소: [],
};

const FilterModal = ({ onClose, onApply, selected, setSelected }) => {
    return (
        <div className="filter-modal">
            <div className="filter-content">
                <h2>필터</h2>

                <div className="category-section">
                    <h4>카테고리</h4>
                    <div className="category-tabs">
                        {Object.keys(categoryOptions).map(cat => (
                            <button
                                key={cat}
                                className={`category-tab ${selected.category === cat ? 'active' : ''}`}
                                onClick={() => setSelected(prev => ({ ...prev, category: cat, subcategory: '' }))}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {categoryOptions[selected.category]?.length > 0 && (
                    <div className="subcategory-section">
                        {categoryOptions[selected.category].map(sub => (
                            <button
                                key={sub}
                                className={`subcategory-chip ${selected.subcategory === sub ? 'active' : ''}`}
                                onClick={() => setSelected(prev => ({ ...prev, subcategory: sub }))}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                )}

                <div className="filter-footer">
                    <button className="apply-btn" onClick={onApply}>적용</button>
                    <button className="close-btn" onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
