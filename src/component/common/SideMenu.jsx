// 햄버거
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import "../../css/common/SideMenu.css";
import LoadingSpinner from "./LoadingSpinner";

const SideMenu = ({ onClose }) => {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/mypage/me");
        setNickname(res.data.nickname);
        setProfileImageUrl(res.data.profileImageUrl);
        setIsLoggedIn(true); // 로그인 성공
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
        setIsLoggedIn(false); //로그인 안 되어 있는 상태
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("로그아웃 되었습니다.");
      navigate("/login");
    } catch (err) {
      toast.error("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="side-menu-overlay show" onClick={onClose}>
      <div className="side-menu" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="user-info-ham">
              {isLoggedIn ? (
                <>
                  {profileImageUrl ? (
                    <img
                      className="profile-image"
                      src={profileImageUrl}
                      alt="프로필"
                    />
                  ) : (
                    <div className="profile-circle" />
                  )}
                  <div className="nickname">{nickname}</div>
                  <div className="logout" onClick={handleLogout}>
                    로그아웃
                  </div>
                </>
              ) : (
                <div className="logged-out">
                  {" "}
                  <div
                    className="login-btn-ham"
                    onClick={() => {
                      navigate("/");
                      onClose(); // 사이드메뉴도 닫아줌
                    }}
                  >
                    로그인하기
                  </div>
                </div>
              )}
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
          </>
        )}
      </div>
    </div>
  );
};

export default SideMenu;
