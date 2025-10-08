import React from "react";
import "../../css/search/PlaceDetailView.css";
import api from "../../api/axios.js";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaPhone,
  FaMapMarkerAlt,
  FaShareAlt,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaLocationArrow,
  FaCommentDots,
} from "react-icons/fa";


import PlaceReview from "./PlaceReview";

/* =========================
   ⭐ 별점 표시 컴포넌트
   - value: 0~5 (소수 1자리까지 표시)
   - 0.25~0.74 => 하프, 0.75 이상 => 풀로 반올림
========================= */
function StarRating({ value = 0 }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  const full = Math.floor(v);
  const decimal = v - full;

  const hasHalf = decimal >= 0.25 && decimal < 0.75;
  const extraFull = decimal >= 0.75 ? 1 : 0;

  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full + extraFull) {
      stars.push(<FaStar key={i} className="star-icon" />);
    } else if (i === full && hasHalf && extraFull === 0) {
      stars.push(<FaStarHalfAlt key={i} className="star-icon" />);
    } else {
      stars.push(<FaRegStar key={i} className="star-icon" />);
    }
  }

  return (
    <div className="rating-wrap">
      <div className="stars">{stars}</div>
      <span className="rating-num">{v.toFixed(1)}</span>
    </div>
  );
}

const PlaceDetailView = ({ place, onBack }) => {
  const [showReviews, setShowReviews] = React.useState(false);
  // 주소 복사 기능은 현재 UI에서 사용하지 않음

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: place.title,
          text: "제주 여행지 추천!",
          url: window.location.href,
        })
        .catch((err) => console.log("공유 취소 또는 실패:", err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("공유 링크가 복사되었습니다!");
    }
  };

  const handleAddToCart = async () => {
    try {
      await api.post("/cart", { placeId: place.placeId });
      toast.success("일정에 추가되었습니다!");
    } catch (err) {
      toast.error("로그인이 필요한 기능입니다.");
      console.error(err);
    }
  };

  const handleDirections = () => {
    const name = encodeURIComponent(place.title || "목적지");
    const hasCoords = typeof place.latitude === "number" && typeof place.longitude === "number";
    if (hasCoords) {
      const url = `https://map.kakao.com/link/to/${name},${place.latitude},${place.longitude}?level=5`;
      window.open(url, "_blank");
      return;
    }
    const query = encodeURIComponent(place.address || place.title || "제주 관광지");
    const url = `https://map.kakao.com/?q=${query}&level=5`;
    window.open(url, "_blank");
  };

  const scrollToReviews = () => {
    setShowReviews(true);
    const el = document.getElementById("reviews");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
              <span className="category">{place.categoryName}</span>
            </div>
          </div>

          {/* 💛 별점 표시 */}
          <div className="rating-section">
            {place.rating ? (
              <StarRating value={place.rating} />
            ) : (
              <span className="no-rating">평가 없음</span>
            )}
          </div>
        </div>

        <div className="image-section">
          {[0].map((i) => (
            <div className="image-card" key={i}>
              {place.imageUrls?.[i] ? (
                <img src={place.imageUrls[i]} alt={`img-${i}`} />
              ) : (
                <div className="image-placeholder" />
              )}
            </div>
          ))}
        </div>

        <button className="schedule-btn" onClick={handleAddToCart}>
          일정 추가하기
        </button>

        <div className="bottom-actions">
          <button className="circle-action" onClick={handleDirections}>
            <div className="circle-icon">
              <FaLocationArrow size={20} />
            </div>
            <span className="circle-label">길찾기</span>
          </button>
          <button className="circle-action" onClick={scrollToReviews}>
            <div className="circle-icon">
              <FaCommentDots size={20} />
            </div>
            <span className="circle-label">리뷰</span>
          </button>
          <button className="circle-action" onClick={handleShare}>
            <div className="circle-icon">
              <FaShareAlt size={20} />
            </div>
            <span className="circle-label">공유</span>
          </button>
        </div>

        <div className="info-section">
          <div className="info-row">
            <FaMapMarkerAlt className="info-icon" />
            <div>
              <div className="info-title">주소</div>
              <div className="info-desc">
                {place.address || "주소 정보 없음"}
              </div>
            </div>
          </div>

          {place.phone && (
            <div className="info-row">
              <FaPhone className="info-icon" />
              <div>
                <div className="info-title">전화번호</div>
                <div className="info-desc">
                  <a
                    href={`tel:${place.phone}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {place.phone}
                  </a>
                </div>
              </div>
            </div>
          )}

          {place.priceInfo && (
            <div className="info-row">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <div className="info-title">요금 정보</div>
                <div className="info-desc">{place.priceInfo}</div>
              </div>
            </div>
          )}

          {place.menu && (
            <div className="info-row">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <div className="info-title">메뉴</div>
                <div className="info-desc">{place.menu}</div>
              </div>
            </div>
          )}

          {place.description && (
            <div className="info-row">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <div className="info-title">장소 소개</div>
                <div className="info-desc">{place.description}</div>
              </div>
            </div>
          )}
        </div>

        {/* ✅ 리뷰: 클릭 시 표시 */}
        {showReviews && (
          <div id="reviews" style={{ marginTop: 8 }}>
            <PlaceReview placeId={place.placeId} reviews={place.review} />
          </div>
        )}
      </div>
    </>
  );
};

export default PlaceDetailView;
