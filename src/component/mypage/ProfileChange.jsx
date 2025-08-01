import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import "../../css/mypage/ProfileChange.css";
import useUserStore from "../../api/userStore"; // ✅ 전역 유저 상태
import { MdArrowBack } from "react-icons/md";

const ProfileChange = ({ onBack }) => {
  const navigate = useNavigate();
  const { user, setUser, clearUser } = useUserStore(); // ✅ 전역 유저 접근

  const [nickname, setNickname] = useState(user?.nickname || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.warn("로그인이 필요합니다.");
      navigate("/login");
    } else {
      setNickname(user.nickname); // 초기값 세팅
    }
  }, [user, navigate]);

  // 저장 버튼
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (nickname.trim().length > 0) {
        await api.patch("/mypage/nickname", {
          newNickname: nickname.trim(),
        });

        // 전역 상태 업데이트
        setUser({ ...user, nickname: nickname.trim() });

        toast.success("프로필이 성공적으로 변경되었습니다.");
        navigate("/mypage");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "정보 저장 중 오류가 발생했습니다.";
      toast.error(message);
      console.error("프로필 변경 실패:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleWithdraw = async () => {
    const confirmed = window.confirm(
      "정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
    );
    if (!confirmed) return;

    try {
      await api.delete("/mypage/withdraw");
      toast.success("회원 탈퇴가 완료되었습니다.");
      clearUser(); // 전역 상태 초기화
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message || "회원 탈퇴 중 오류가 발생했습니다.";
      toast.error(message);
      console.error("회원 탈퇴 실패:", err);
    }
  };

  return (
    <div className="profile-change-container">
      <button className="back-btn" onClick={onBack}>
        <MdArrowBack size={24} />
      </button>
      <div className="section">
        <label className="label">닉네임</label>
        <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
          <input
            type="text"
            className="nickname-input"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button
            type="button"
            className="btn-check"
            onClick={async () => {
              if (!nickname.trim()) {
                toast.warn("닉네임을 입력해주세요.");
                return;
              }
              try {
                const res = await api.get("/users/check/nickname", {
                  params: { nickname: nickname.trim() },
                });
                if (res.data.exists) {
                  toast.error("중복된 닉네임입니다.");
                } else {
                  toast.success("사용 가능한 닉네임입니다.");
                }
              } catch (err) {
                toast.error("닉네임 중복 확인 중 오류가 발생했습니다.");
              }
            }}
          >
            중복확인
          </button>
        </div>
      </div>

      <div className="section password-section">
        <label className="label">비밀번호 변경</label>
        <button
          className="change-btn"
          onClick={() => navigate("/changepassword")}
        >
          변경하러 가기
        </button>
      </div>

      <div className="submit-btn-wrap">
        <button className="save-btn" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "저장 중..." : "저장하기"}
        </button>
      </div>

      <div className="section">
        <label className="label" style={{ marginBottom: "3rem" }}>
          회원 탈퇴
        </label>
        <button className="delete-btn" onClick={handleWithdraw}>
          회원 탈퇴
        </button>
      </div>
    </div>
  );
};

export default ProfileChange;
