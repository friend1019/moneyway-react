// SideMenu.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import "../css/SideMenu.css";

const SideMenu = ({ onClose }) => {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/mypage/me");
        setNickname(res.data.nickname);
        setProfileImageUrl(res.data.profileImageUrl); // 프로필 이미지 URL 추가
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      alert("로그아웃 되었습니다.");
      navigate("/login");
    } catch (err) {
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="side-menu-overlay show" onClick={onClose}>
      <div className="side-menu" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <div className="user-info">
          {profileImageUrl ? (
            <img className="profile-image" src={profileImageUrl} alt="프로필" />
          ) : (
            <div className="profile-circle" />
          )}
          <div className="nickname">{nickname}</div>
          <div className="logout" onClick={handleLogout}>
            로그아웃
          </div>
        </div>
        <ul className="menu-list">
          <li>
            <Link to="/ai-plan">AI 플랜 생성</Link>
          </li>
          <li>
            <Link to="/myplan">나만의 플랜 생성</Link>
          </li>
          <li>
            <Link to="/community">커뮤니티</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;
