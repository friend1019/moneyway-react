import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Profile from "./Profile";
import ProfileChange from "./ProfileChange";
import MyArticles from "./MyArticles";
import Scrap from "./Scarp";
import api from "../../api/axios";
import '../../css/mypage/MyPage.css';

const MyPage = () => {
  const [view, setView] = useState("default");
  const isEdit = view === "edit";
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout"); // 명세서 기반 로그아웃
    } catch (err) {
      console.warn("로그아웃 실패 (세션 만료 등):", err);
    } finally {
      navigate("/login");
    }
  };

  const handleWithdraw = async () => {
    const confirm = window.confirm(
      "정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
    );
    if (!confirm) return;

    try {
      await api.delete("/api/mypage/withdraw");
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "회원 탈퇴 중 오류가 발생했습니다.";
      alert(message);
      console.error("회원 탈퇴 오류:", err);
    }
  };

  return (
    <>
      <Header />
      <div className={`main-container ${isEdit ? "edit-mode" : ""}`}>
        {!isEdit && (
          <div className="nav-bar">
            <button onClick={() => setView("scrap")}>스크랩 목록</button>
            <button onClick={() => setView("posts")}>내가 쓴 글</button>
          </div>
        )}

        <div className="profile-container">
          <Profile onEditClick={() => setView("edit")} />
          <div className="account-actions">
            <button className="btn-logout" onClick={handleLogout}>
              로그아웃
            </button>
            <button className="btn-withdraw" onClick={handleWithdraw}>
              회원 탈퇴
            </button>
          </div>
        </div>

        <div className="sub-container">
          {view === "scrap" && <Scrap />}
          {view === "posts" && <MyArticles />}
          {view === "edit" && <ProfileChange />}
        </div>
      </div>
    </>
  );
};

export default MyPage;
