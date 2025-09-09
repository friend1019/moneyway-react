import React from "react";
import "../../css/search/PlaceDetailView.css";
import api from "../../api/axios.js";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaHeart,
  FaPhone,
  FaMapMarkerAlt,
  FaShareAlt,
  FaCopy,
} from "react-icons/fa";

/* ✅ 리뷰 컴포넌트 임포트 (같은 폴더라고 가정) */
import PlaceReview from "./PlaceReview";

const PlaceDetailView = ({ place, onBack }) => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(place.address || "");
    toast.success("주소가 복사되었습니다!");
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
      toast.success("공유 링크가 복사되었습니다!");
    }
  };

  const handleAddToCart = async () => {
    try {
      console.log("추가할 placeId:", place.placeId);

      await api.post("/cart", {
        placeId: place.placeId,
      });
      toast.success("일정에 추가되었습니다!");
    } catch (err) {
      toast.error("추가 중 오류가 발생했습니다.");
      console.error(err);
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
              <span className="category">{place.categoryName}</span>
            </div>
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

        <button className="schedule-btn" onClick={handleAddToCart}>
          장바구니에 추가하기
        </button>

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

        {/* ✅ 더미 리뷰 표시 */}
        <PlaceReview placeId={place.placeId} />
      </div>
    </>
  );
};

export default PlaceDetailView;
