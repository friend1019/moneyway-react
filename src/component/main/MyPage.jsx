import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Profile from "./Profile";
import ProfileChange from "./ProfileChange";
import api from "../../api/axios";
import '../../css/main/MyPage.css';

const MyPage = () => {
  const [view, setView] = useState('default');
  const isEdit = view === 'edit';
  const navigate = useNavigate();

  const handleWithdraw = async () => {
    const confirm = window.confirm("정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    if (!confirm) return;

    try {
      await api.delete("/mypage/withdraw");
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Header />
      <div className={`main-container ${isEdit ? 'edit-mode' : ''}`}>
        {!isEdit && (
          <div className="nav-bar">
            <button onClick={() => setView('scrap')}>스크랩 목록</button>
            <button onClick={() => setView('posts')}>내가 쓴 글</button>
          </div>
        )}

        <div className="profile-container">
          <Profile onEditClick={() => setView('edit')} />
          {/* 🔽 여기 로그아웃 아래에 회원탈퇴 버튼 추가 */}
          <div className="account-actions">
            <button className="btn-logout" onClick={() => navigate("/login")}>
              로그아웃
            </button>
            <button className="btn-withdraw" onClick={handleWithdraw}>
              회원 탈퇴
            </button>
          </div>
        </div>

        <div className="sub-container">
          {view === 'scrap' && <div>스크랩 목록 컴포넌트</div>}
          {view === 'posts' && <div>내가 쓴 글 컴포넌트</div>}
          {view === 'edit' && <ProfileChange />}
        </div>
      </div>
    </>
  );
};

export default MyPage;
