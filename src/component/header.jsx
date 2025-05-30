import { Link } from "react-router-dom";

import "../css/header.css";

import logo from "../images/header/logo.svg";
import search from "../images/header/search.svg";
import menu from "../images/header/menu.svg";
import account from "../images/header/account.svg";

function Header() {

  return (
    <div className="header">
      <header className="header-top">
        <div className="header-top-container">
          <Link to="/main" className="logo-area">
            <img src={logo} alt="logo" />
          </Link>

          <nav className="navbar-container">
            <li className="nav-item">
              <Link className="nav-link" to="/search">
                <img src={search} alt="search" className="nav-icon" />
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/myplan">
                <span className="myplan">내 계획</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/menu">
                <img src={menu} alt="menu" className="nav-icon" />
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
    </div>
  );
}
export default Header;
