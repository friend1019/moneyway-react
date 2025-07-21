import React, { useState, useEffect } from "react";
import { FaImage } from "react-icons/fa6";
import { FaTrophy } from "react-icons/fa";
import api from "../../api/axios";
import "../../css/community/PostCreateForm.css";
import { toast } from "react-toastify";

const PostCreateForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [totalCost, setTotalCost] = useState("");
  const [isChallenge, setIsChallenge] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    // 내 프로필 이미지 불러오기
    const fetchProfile = async () => {
      try {
        const res = await api.get("/mypage/me");
        setProfileImg(res.data.profileImageUrl);
      } catch (err) {
        console.error("프로필 이미지 로딩 실패", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    try {
      const body = {
        title,
        content,
        totalCost: budgetEnabled ? parseInt(totalCost) : null,
        isChallenge,
        thumbnailUrl,
        imageUrls,
      };

      await api.post("/posts", body);
      toast.success("글이 등록되었습니다!");
      // 작성 후 리셋하거나 이동 처리
    } catch (err) {
      console.error("글 등록 실패", err);
      toast.error("글 등록에 실패했습니다.");
    }
  };

  const isFormValid = title.trim() !== "" && content.trim() !== "";

  return (
    <div className="post-form-wrapper">
      <div className="post-header">
        <div className="post-header-row">
          <input
            className="post-title-input"
            placeholder="제목을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div
            className="challenge-toggle"
            onClick={() => setIsChallenge(!isChallenge)}
          >
            <FaTrophy size={20} color={isChallenge ? "#0066F9" : "#BBD6FF"} />
            <span
              className={
                isChallenge ? "challenge-label active" : "challenge-label"
              }
            >
              Challenge
            </span>
          </div>
        </div>
        <div className="divider" />
      </div>

      <div className="post-body">
        <img src={profileImg} alt="프로필" className="profile-img" />
        <textarea
          className="post-content-input"
          placeholder="나의 여행을 공유해보세요!"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div >
      <div className="divider" />

      <div className="post-footer">
        {/* 왼쪽: 예산 */}
        <div className="budget-group">
          <label className="budget-checkbox">
            <input
              type="checkbox"
              checked={budgetEnabled}
              onChange={() => setBudgetEnabled(!budgetEnabled)}
            />
            나의 예산
          </label>
          <input
            className={`budget-input ${budgetEnabled ? "active" : "inactive"}`}
            placeholder="₩ 0"
            disabled={!budgetEnabled}
            value={totalCost}
            onChange={(e) => setTotalCost(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        {/* 오른쪽: 이미지 + 공유 */}
        <div className="action-group">
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            id="image-upload"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              const newUrls = files.map((file) => URL.createObjectURL(file));
              setImageUrls((prev) => [...prev, ...newUrls].slice(0, 10)); // 최대 10개
            }}
          />

          <label htmlFor="image-upload" className="upload-btn">
            <FaImage size={25} />
          </label>

          <button
            className={`submit-btn ${isFormValid ? "active" : "disabled"}`}
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            공유하기 ↑
          </button>
        </div>
      </div>
      {imageUrls.length > 0 && (
        <div className="thumbnail-selector">
          <p className="thumbnail-title">
            썸네일로 사용할 이미지를 선택하세요:
          </p>
          <div className="thumbnail-image-list">
            {imageUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`uploaded-${idx}`}
                className={`thumbnail-image ${
                  thumbnailUrl === url ? "selected" : ""
                }`}
                onClick={() => setThumbnailUrl(url)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCreateForm;
