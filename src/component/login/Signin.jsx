import React from "react";
import LoginHeader from "./LoginHeader";
import Header from "../Header.jsx";
import "../../css/login/Signin.css";
import "../../css/login/LoginPage.css";

const Signin = () => {
  return (
    <>
      <Header />
      <div className="container">
        <div className="login-header">
          <LoginHeader />
        </div>
        <div className="login-form">
          <form>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="moneyway@gmail.com"
              className="input-field"
            />

            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="8자 이상"
              className="input-field"
            />

            <button type="submit" className="btn-login" disabled>
              로그인
            </button>
          </form>

          <a href="/forgot-pwd" className="find-password-link">
            비밀번호 찾기
          </a>
        </div>
      </div>
    </>
  );
};

export default Signin;
