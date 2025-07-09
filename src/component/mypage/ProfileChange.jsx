import React, { useState } from "react";
import api from "../../api/axios";
import "../../css/mypage/ProfileChange.css";

const ProfileChange = () => {
  const [nickname, setNickname] = useState("땡땡이");
  const [password, setPassword] = useState("");
  const [isChangingPw, setIsChangingPw] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // 닉네임 변경
      if (nickname.trim().length > 0) {
        await api.patch("/api/mypage/nickname", {
          newNickname: nickname.trim(),
        });
        alert("닉네임이 성공적으로 변경되었습니다.");
      }

      // 비밀번호 변경은 명세서상 로그인 상태에서 직접 재설정 불가능
      if (isChangingPw && password.length > 0) {
        alert("비밀번호 변경 기능은 아직 연결되지 않았습니다.");
        // ※ API 필요 시 백엔드에 로그인 상태에서의 비밀번호 변경 API 요청 필요
      }
    } catch (err) {
      const message = err.response?.data?.message || "정보 저장 중 오류가 발생했습니다.";
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
        <button className="upload-btn" disabled>
          사진 업로드하기 <span className="icon">🔄</span>
        </button>
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
        <input
          type="password"
          placeholder="8자리 이상"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!isChangingPw}
        />
        <button
          className="change-btn"
          onClick={() => setIsChangingPw((prev) => !prev)}
        >
          {isChangingPw ? "취소" : "변경하기"}
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
