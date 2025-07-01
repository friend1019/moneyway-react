// PlaceDetailView.jsx
import React from 'react';
import '../../css/search/PlaceDetailView.css';
import {
  FaArrowLeft,
  FaHeart,
  FaClock,
  FaStar,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const CATEGORY_NAME_MAP = {
  RESTAURANT: '식당',
  ATTRACTION: '관광지',
  ACTIVITY: '액티비티',
  ACCOMMODATION: '숙소',
};

const PlaceDetailView = ({ place, onBack }) => {
  const tags = place.tag?.split(',').map(tag => tag.trim()).filter(Boolean) || [];
  const categoryName = CATEGORY_NAME_MAP[place.category] || place.category || '기타';

  return (
    <>
      <button className="back-btn" onClick={onBack}>
        <FaArrowLeft />
      </button>

      <div className="place-detail">
        <div className="detail-header">
          <div className="title-section">
            <h2>{place.title}</h2>
            <div className="meta">
              <span className="category">{categoryName}</span>
              <span className="rating">
                {[1, 2, 3, 4, 5].map(i => (
                  <FaStar key={i} color={i <= place.rating ? '#ffc107' : '#ddd'} />
                ))}
              </span>
            </div>
            {tags.length > 0 && (
              <div className="tag-section">
                {tags.map((tag, i) => (
                  <span key={i} className="tag-chip">{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="like-section">
            <FaHeart className="heart-icon" />
            <span>567</span>
          </div>
        </div>

        <div className="image-section">
          {[0, 1].map(i => (
            <div className="image-card" key={i}>
              {place.imageUrls?.[i] ? (
                <img src={place.imageUrls[i]} alt={`img-${i}`} />
              ) : (
                <div className="image-placeholder" />
              )}
            </div>
          ))}
        </div>

        <div className="action-buttons">
          <button>길찾기</button>
          <button>리뷰</button>
          <button>공유</button>
        </div>

        <button className="schedule-btn">일정 추가하기</button>

        <div className="info-section">
          <div className="info-row">
            <FaMapMarkerAlt className="info-icon" />
            <div>
              <div className="info-title">주소</div>
              <div className="info-desc">{place.address || '주소 정보 없음'}</div>
            </div>
          </div>

          {place.phone && (
            <div className="info-row">
              <FaPhone className="info-icon" />
              <div>
                <div className="info-title">전화번호</div>
                <div className="info-desc">{place.phone}</div>
              </div>
            </div>
          )}

          {place.overview && (
            <div className="info-row">
              <FaClock className="info-icon" />
              <div>
                <div className="info-title">장소 소개</div>
                <div className="info-desc">{place.overview}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlaceDetailView;
