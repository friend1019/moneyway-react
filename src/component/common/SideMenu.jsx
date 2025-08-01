// src/components/common/SideMenu.jsx
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "../../api/userStore";
import api from "../../api/axios";
import "../../css/common/SideMenu.css";

const SideMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useUserStore(); // ✅ logout 사용
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // ✅ 서버에 로그아웃 요청
      logout(); // ✅ Zustand + localStorage 초기화
      navigate("/");
      toast.success("로그아웃 되었습니다.");
    } catch (err) {
      console.error("로그아웃 에러:", err);
      toast.error("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="side-menu-overlay show" onClick={onClose}>
      <div className="side-menu" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="user-info-ham">
          {isLoggedIn ? (
            <>
              {user.profileImageUrl ? (
                <img
                  className="profile-image-sidemenu"
                  src={user.profileImageUrl}
                  alt="프로필"
                />
              ) : (
                <div className="profile-circle" />
              )}
              <div className="nickname">{user.nickname}</div>
              <div className="logout" onClick={handleLogout}>
                로그아웃
              </div>
            </>
          ) : (
            <div className="logged-out">
              <div
                className="login-btn-ham"
                onClick={() => {
                  navigate("/login");
                  onClose();
                }}
              >
                로그인하세요
              </div>
            </div>
          )}
        </div>

        <ul className="menu-list">
          <li>
            <Link to="/aiplan">AI 플랜 생성</Link>
          </li>
          <li>
            <Link to="/create-plan">나만의 플랜 생성</Link>
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
