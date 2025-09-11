// src/components/common/Header.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
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

  // ✅ 흰 배경을 적용할 경로 규칙
  const whiteBgPaths = useMemo(
    () => [
      "/mypage",
      "/cart",
      "/planlist",
      "/search",
      // 필요하면 더 추가
    ],
    []
  );

  // ✅ 동적 라우트 대응 헬퍼: startsWith 매칭 + 패턴 일부 예시
  const isWhiteBg = useMemo(() => {
    const p = location.pathname;
    if (whiteBgPaths.includes(p)) return true;

    // 예: /post/:id, /article/:id, /event/:id 등
    const dynamicStarts = ["/post/", "/article/", "/event/"];
    if (dynamicStarts.some((s) => p.startsWith(s))) return true;

    // 예: 홈도 흰색을 쓰고싶다면 아래 주석 해제
    // if (p === "/") return true;

    return false;
  }, [location.pathname, whiteBgPaths]);

  // 기존: /cart 에서 hover 효과 활성화
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
