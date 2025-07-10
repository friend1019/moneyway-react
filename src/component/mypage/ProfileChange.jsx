import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../css/mypage/ProfileChange.css";

const ProfileChange = () => {
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // ✅ 현재 닉네임 및 프로필 이미지 불러오기
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const res = await api.get("/mypage/me");
        setNickname(res.data.nickname || "");
        if (res.data.profileImageUrl) {
          setPreviewUrl(res.data.profileImageUrl); // 기존 프로필 이미지 미리보기
        }
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
        alert("정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchMyInfo();
  }, []);

  // ✅ 이미지 선택 시 미리보기 생성
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ✅ 저장 버튼 핸들러
  const handleSave = async () => {
    setIsSaving(true);

    try {
      // 닉네임 저장
      if (nickname.trim().length > 0) {
        await api.patch("/mypage/nickname", {
          newNickname: nickname.trim(),
        });
      }

      // 프로필 이미지 업로드
      if (profileImage) {
        const formData = new FormData();
        formData.append("image", profileImage);
        await api.post("/mypage/profile-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("프로필이 성공적으로 변경되었습니다.");
      navigate("/mypage");
    } catch (err) {
      const message =
        err.response?.data?.message || "정보 저장 중 오류가 발생했습니다.";
      alert(message);
      console.error("프로필 변경 실패:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-change-container">
      <div className="section">
        <label className="label">프로필 사진</label>
        <button
          className="upload-btn"
          onClick={() => fileInputRef.current.click()}
        >
          사진 업로드하기 <span className="icon">🔄</span>
        </button>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        {previewUrl && (
          <div className="preview">
            <img src={previewUrl} alt="미리보기" className="preview-image" />
          </div>
        )}
      </div>

      <div className="section">
        <label className="label">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      <div className="section password-section">
        <label className="label">비밀번호 변경</label>
        <button
          className="change-btn"
          onClick={() => navigate("/resetpassword")}
        >
          변경하러 가기
        </button>
      </div>

      <div className="section">
        <label className="label">회원 탈퇴</label>
        <button
          className="delete-btn"
          onClick={async () => {
            const confirmed = window.confirm(
              "정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
            );
            if (!confirmed) return;

            try {
              await api.delete("/mypage/withdraw");
              alert("회원 탈퇴가 완료되었습니다.");
              navigate("/login");
            } catch (err) {
              const message =
                err.response?.data?.message ||
                "회원 탈퇴 중 오류가 발생했습니다.";
              alert(message);
              console.error("회원 탈퇴 실패:", err);
            }
          }}
        >
          회원 탈퇴
        </button>
      </div>

      <div className="submit-btn-wrap">
        <button className="save-btn" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </div>
  );
};

export default ProfileChange;
