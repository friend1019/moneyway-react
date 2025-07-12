import React from 'react';
import '../../css/search/PlaceCard.css';
import { FaHeart, FaStar, FaRegStar } from 'react-icons/fa';

const PlaceCard = ({ title, category, address, status, rating, imageUrls = [], onClick }) => {
  // 별점 5개 생성
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= rating ? (
        <FaStar key={i} className="star filled" />
      ) : (
        <FaRegStar key={i} className="star" />
      )
    );
  }

  return (
    <div className="place-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="card-header">
        <div>
          <span className="place-title">{title}</span>
          <span className="place-rating">{stars}</span>
          {/* <p className="place-status">{status}</p> */}
        </div>
        <button className="favorite-btn" onClick={e => e.stopPropagation()}>
          <FaHeart />
        </button>
      </div>

      <div className="card-subinfo">
        <span className="place-category">{category}</span>
        <span className='place-section'>/</span>
        <span className="place-address">{address}</span>
      </div>

      <div className="place-images">
        {imageUrls.slice(0, 2).map((url, idx) => (
          <div
            key={idx}
            className="place-image-box"
            style={{ backgroundImage: `url(${url})` }}
          />
        ))}
      </div>
    </div>
  );
};

export default PlaceCard;
