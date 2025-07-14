import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SideMenu from "./SideMenu";
import api from "../../api/axios"; // ✅ axios 인스턴스

import "../../css/common/Header.css";

import logo from "../../images/header/logo.svg";
import menu from "../../images/header/menu.svg";
import account from "../../images/header/account.svg";
import cartlogo from "../../images/header/cart.svg";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // ✅ 로그인 유저 정보 fetch
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/mypage/me");
        setNickname(res.data.nickname);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="header">
      <header className="header-top">
        <div className="header-top-container">
          <div className="logo-area">
            <Link to="/" className="logo-link">
              <img src={logo} alt="logo" />
            </Link>

            {/* ✅ 로그인 시에만 문구 표시 (로고 바로 오른쪽) */}
            {!loading && isLoggedIn && (
              <span className="welcome-text">
                <span className="nickname-text">{nickname}</span>님, 머니웨이에
                오신걸 환영합니다!
              </span>
            )}
          </div>

          <nav className="navbar-container">
            <li className="nav-item">
              <Link className="nav-link" to="/myplan">
                <span className="myplan">내 계획</span>
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={toggleMenu}>
                <img src={menu} alt="menu" className="nav-icon" />
              </button>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                <img src={cartlogo} alt="cart" className="nav-icon" />
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mypage">
                <img src={account} alt="account" className="nav-icon" />
              </Link>
            </li>
          </nav>
        </div>
      </header>
      {isMenuOpen && <SideMenu onClose={toggleMenu} />}
    </div>
  );
}

export default Header;
