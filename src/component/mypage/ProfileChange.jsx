import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import "../../css/mypage/ProfileChange.css";

const ProfileChange = () => {
  const [nickname, setNickname] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // 현재 닉네임 및 프로필 이미지 불러오기
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const res = await api.get("/mypage/me");
        setNickname(res.data.nickname || "");
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
        toast.warn("정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchMyInfo();
  }, []);

  // 저장 버튼
  const handleSave = async () => {
    setIsSaving(true);

    try {
      // 닉네임 저장
      if (nickname.trim().length > 0) {
        await api.patch("/mypage/nickname", {
          newNickname: nickname.trim(),
        });
      }

      toast.success("프로필이 성공적으로 변경되었습니다.");
      navigate("/mypage");
    } catch (err) {
      const message =
        err.response?.data?.message || "정보 저장 중 오류가 발생했습니다.";
      toast.error(message);
      console.error("프로필 변경 실패:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-change-container">
      <div className="section">
        <label className="label">닉네임</label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
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
              toast.success("회원 탈퇴가 완료되었습니다.");
              navigate("/login");
            } catch (err) {
              const message =
                err.response?.data?.message ||
                "회원 탈퇴 중 오류가 발생했습니다.";
              toast.error(message);
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
