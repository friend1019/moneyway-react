import React from "react";
import "../../css/search/PlaceDetailView.css";
import {
  FaArrowLeft,
  FaHeart,
  FaClock,
  FaStar,
  FaPhone,
  FaMapMarkerAlt,
  FaShareAlt,
  FaCopy,
  FaThumbtack,
} from "react-icons/fa";

const CATEGORY_NAME_MAP = {
  RESTAURANT: "식당",
  ATTRACTION: "관광지",
  ACTIVITY: "액티비티",
  ACCOMMODATION: "숙소",
};

const SIGUNGU_NAME_MAP = {
  3: "서귀포시",
  4: "제주시",
};

const PlaceDetailView = ({ place, onBack }) => {
  const tags =
    place.tag
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) || [];
  const categoryName =
    CATEGORY_NAME_MAP[place.category] || place.category || "기타";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(place.address || "");
    alert("주소가 복사되었습니다!");
  };

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
      alert("공유 링크가 복사되었습니다!");
    }
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
              <span className="category">{categoryName}</span>
              <span className="rating">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar
                    key={i}
                    color={i <= place.rating ? "#ffc107" : "#ddd"}
                  />
                ))}
              </span>
            </div>
            {tags.length > 0 && (
              <div className="tag-section">
                {tags.map((tag, i) => (
                  <span key={i} className="tag-chip">
                    {tag}
                  </span>
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

        <div className="action-buttons">
          <button onClick={handleCopyAddress}>
            <FaCopy style={{ marginRight: "6px" }} />
            주소 복사
          </button>
          <button onClick={handleShare}>
            <FaShareAlt style={{ marginRight: "6px" }} />
            공유
          </button>
          {place.phone && (
            <a href={`tel:${place.phone}`} style={{ textDecoration: "none" }}>
              <button>
                <FaPhone style={{ marginRight: "6px" }} />
                전화걸기
              </button>
            </a>
          )}
        </div>

        <button className="schedule-btn">일정 추가하기</button>

        <div className="info-section">
          {place.sigungucode && SIGUNGU_NAME_MAP[place.sigungucode] && (
            <div className="info-row">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <div className="info-title">지역</div>
                <div className="info-desc">
                  {SIGUNGU_NAME_MAP[place.sigungucode]}
                </div>
              </div>
            </div>
          )}

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

          {place.useTime && (
            <div className="info-row">
              <FaClock className="info-icon" />
              <div>
                <div className="info-title">운영시간</div>
                <div className="info-desc">
                  {place.useTime.split("<br>").map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 요금 정보 */}
          {place.price !== undefined && (
            <div className="info-row">
              <FaStar className="info-icon" />
              <div>
                <div className="info-title">요금</div>
                <div className="info-desc">
                  {place.price > 0
                    ? `${place.price.toLocaleString()}원`
                    : "무료"}
                </div>
              </div>
            </div>
          )}

          {place.overview && (
            <div className="info-row">
              <FaClock className="info-icon" />
              <div>
                <div className="info-title">장소 소개</div>
                <div className="info-desc">
                  {place.overview.split("<br>").map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 비고 (infotext) */}
          {place.infotext && (
            <div className="info-row">
              <FaThumbtack className="info-icon" />
              <div>
                <div className="info-title">비고</div>
                <div className="info-desc">
                  {place.infotext.split("<br>").map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlaceDetailView;
