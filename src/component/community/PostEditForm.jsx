import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaImage } from "react-icons/fa6";
import { toast } from "react-toastify";
import api from "../../api/axios";
import useUserStore from "../../api/userStore";
import "../../css/community/PostCreateForm.css";
import HomeButton from "./HomeButton";

const PostEditForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const profileImg = user?.profileImageUrl;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [totalCost, setTotalCost] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  // 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${postId}`);
        const data = res.data || {};
        setTitle(data.title || "");
        setContent(data.content || "");
        setThumbnailUrl(data.thumbnailUrl || "");
        setImageUrls(Array.isArray(data.imageUrls) ? data.imageUrls : []);
        if (data.totalCost != null) {
          setBudgetEnabled(true);
          setTotalCost(String(data.totalCost));
        } else {
          setBudgetEnabled(false);
          setTotalCost("");
        }
      } catch (err) {
        console.error("게시글 불러오기 실패", err);
        toast.error("게시글 정보를 불러오지 못했습니다.");
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async () => {
    try {
      const body = {
        title,
        content,
        totalCost: budgetEnabled ? parseInt(totalCost || "0", 10) : null,
        thumbnailUrl,
        imageUrls,
      };

      await api.patch(`/posts/${postId}`, body);
      toast.success("게시글이 수정되었습니다!");
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error("게시글 수정 실패", err);
      const message = err.response?.data?.message || "게시글 수정에 실패했습니다.";
      toast.error(message);
    }
  };

  const isFormValid = title.trim() !== "" && content.trim() !== "";

  return (
    <>
      <HomeButton showBack={true} />
      <div className="post-form-whole-wrapper">
        <div className="post-form-wrapper">
          {/* 헤더 */}
          <div className="post-header-create">
            <div className="post-header-row">
              <input
                className="post-title-input"
                placeholder="제목을 입력하세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="divider" />
          </div>

          {/* 본문 */}
          <div className="post-body">
            <img
              src={profileImg || "https://via.placeholder.com/40"}
              alt="프로필"
              className="profile-img"
            />
            <textarea
              className="post-content-input"
              placeholder="나의 여행을 공유해보세요!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={5000}
            />
          </div>

          <div className="divider" />

          {/* 푸터 */}
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

            {/* 오른쪽: 이미지 + 수정 */}
            <div className="action-group">
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                id="image-upload"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const newUrls = files.map((file) => URL.createObjectURL(file));
                  setImageUrls((prev) => [...prev, ...newUrls].slice(0, 10)); // 최대 10개
                }}
              />
              <label htmlFor="image-upload" className="upload-btn" title="이미지 업로드">
                <FaImage size={25} />
              </label>

              <button
                className={`submit-btn ${isFormValid ? "active" : "disabled"}`}
                onClick={handleSubmit}
                disabled={!isFormValid}
              >
                수정하기 ✓
              </button>
            </div>
          </div>

          {/* 썸네일 선택 */}
          {imageUrls.length > 0 && (
            <div className="thumbnail-selector">
              <p className="thumbnail-title">썸네일로 사용할 이미지를 선택하세요:</p>
              <div className="thumbnail-image-list">
                {imageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`uploaded-${idx}`}
                    className={`thumbnail-image ${thumbnailUrl === url ? "selected" : ""}`}
                    onClick={() => setThumbnailUrl(url)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PostEditForm;
