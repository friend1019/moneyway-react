// SearchPlaceBox.jsx
import React, { useEffect, useState } from 'react';
import '../../css/search/SearchPlaceBox.css';

const CATEGORY_NAME_MAP = {
  RESTAURANT: '식당',
  ATTRACTION: '관광지',
  ACTIVITY: '액티비티',
  ACCOMMODATION: '숙소',
};

const SearchPlaceBox = ({ keyword, onSelect, fetchPlaces }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPlaces = async () => {
      if (!keyword) return;
      setLoading(true);
      try {
        const data = await fetchPlaces();
        setPlaces(
          data.filter(
            (p) =>
              p.title?.toLowerCase().includes(keyword.toLowerCase()) ||
              p.tag?.toLowerCase().includes(keyword.toLowerCase())
          )
        );
      } catch (e) {
        console.error('장소 로딩 실패:', e);
      }
      setLoading(false);
    };
    loadPlaces();
  }, [keyword, fetchPlaces]);

  const renderStars = (rating = 0) => {
    const stars = Math.round(rating);
    return (
      <span className="star-rating">
        <span className="rating-number">{rating.toFixed(1)}</span>
        <span className="stars">
          {'★'.repeat(stars)}
          {'☆'.repeat(5 - stars)}
        </span>
      </span>
    );
  };

  return (
    <div className="search-place-box">
      {loading ? (
        <div className="search-loading">불러오는 중...</div>
      ) : places.length === 0 ? (
        <div className="search-no-result">검색 결과가 없습니다.</div>
      ) : (
        places.map((place) => (
          <div key={place.contentId} className="search-item" onClick={() => onSelect(place)}>
            <img src={place.imageUrls?.[0]} alt={place.title} />
            <div className="search-item-info">
              <div className="search-title-row">
                <strong>{place.title}</strong>
                {renderStars(place.rating)}
              </div>
              <span className="meta">{CATEGORY_NAME_MAP[place.category] || '기타'}</span>
              <span className="meta">{place.address}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchPlaceBox;
