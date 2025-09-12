// src/components/common/Header.jsx
import { Link, useNavigate, useLocation, matchPath } from "react-router-dom";
import { useState, useMemo } from "react";
import SideMenu from "./SideMenu";
import useUserStore from "../../api/userStore";
import "../../css/common/Header.css";

import logo from "../../images/header/logo2.svg";
import menu from "../../images/header/menu.svg";
import account from "../../images/header/account.svg";
import cartlogo from "../../images/header/cart.svg";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const { user } = useUserStore();
  const isLoggedIn = !!user;
  const hasProfileImage = !!user?.profileImageUrl;

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 흰 배경을 적용할 경로 패턴 (정확/부분 매칭 혼합)
  // - end: true  → 해당 경로 '정확히' 일치할 때만
  // - end: false → 해당 경로로 '시작하는' 모든 하위 경로 포함 (prefix 매칭)
  const whiteBgPatterns = useMemo(
    () => [
      { path: "/mypage", end: true },
      { path: "/cart", end: true },
      { path: "/planlist", end: true },
      { path: "/search", end: true },
      { path: "/login", end: true },
      { path: "/signup", end: true },
      { path: "/community", end: true },

      // ✅ posts 전용: 리스트/작성/상세/수정 등 전체 포함
      //   - /posts                (리스트)
      //   - /posts/create         (작성)
      //   - /posts/1              (상세)
      //   - /posts/1/edit         (수정)
      { path: "/posts", end: false }, // prefix 매칭으로 자식 경로 모두 포함
    ],
    []
  );

  const isWhiteBg = useMemo(() => {
    const pathname = location.pathname;
    return whiteBgPatterns.some((p) => matchPath({ path: p.path, end: p.end }, pathname));
  }, [location.pathname, whiteBgPatterns]);

  // 기존: /cart 에서 hover 효과 활성화 (그대로 유지)
  const hoverEnabled = location.pathname.startsWith("/cart");

  const handleProtectedRoute = (path) => {
    if (isLoggedIn) navigate(path);
    else navigate("/login");
  };

  return (
    <div className={`header ${hoverEnabled ? "hover-enabled" : ""} ${isWhiteBg ? "white-bg" : ""}`}>
      <header className="header-top">
        <div className="header-top-container">
          <div className="logo-area">
            <Link to="/" className="logo-link">
              <img src={logo} alt="logo" />
            </Link>
          </div>

          <nav className="navbar-container">
            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => handleProtectedRoute("/planlist")}
              >
                <span className="myplan">내 계획</span>
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => handleProtectedRoute("/cart")}
              >
                <img src={cartlogo} alt="cart" className="nav-icon" />
              </button>
            </li>

            <li className="nav-item">
              <button className="nav-link" onClick={toggleMenu}>
                <img src={menu} alt="menu" className="nav-icon" />
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link"
                onClick={() => handleProtectedRoute("/mypage")}
              >
                {isLoggedIn && hasProfileImage ? (
                  <img
                    src={user.profileImageUrl}
                    alt="profile"
                    className="nav-icon profile-image-header"
                  />
                ) : (
                  <img src={account} alt="account" className="nav-icon" />
                )}
              </button>
            </li>
          </nav>
        </div>
      </header>

      {isMenuOpen && <SideMenu onClose={toggleMenu} />}
    </div>
  );
}

export default Header;
