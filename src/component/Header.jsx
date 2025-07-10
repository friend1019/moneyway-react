// Header.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import SideMenu from "./SideMenu";

import "../css/Header.css";

import logo from "../images/header/logo.svg";
import menu from "../images/header/menu.svg";
import account from "../images/header/account.svg";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className="header">
      <header className="header-top">
        <div className="header-top-container">
          <Link to="/" className="logo-area">
            <img src={logo} alt="logo" />
          </Link>

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