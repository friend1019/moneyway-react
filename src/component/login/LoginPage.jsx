import React from "react";
import "../../css/login/LoginPage.css";
import LoginHeader from "./LoginHeader";
import Header from "../header";

import kakaoIcon from "../../images/login/kakaoAuth.svg";
import googleIcon from "../../images/login/googleAuth.svg";

const LoginPage = () => {
  //카카오 로그인
  const handleKakaoLogin = () => {
    window.location.href =
      "http://192.168.208.20:8081/oauth2/authorization/kakao"; // 백엔드 카카오 로그인 URL
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="login-header">
          <LoginHeader />
        </div>
        <div className="auth-container">
          <div className="auth-header">간편가입 하기 😎</div>

          <div className="social-buttons">
            <button className="social-btn kakao-btn">
              <img
                src={kakaoIcon}
                alt="카카오 로그인"
                style={{ width: "56px", height: "56px", objectFit: "contain" }}
              />
            </button>
            <button
              className="social-btn google-btn"
              onClick={handleKakaoLogin}
            >
              <img
                src={googleIcon}
                alt="구글 로그인"
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
            </button>
          </div>

          <button className="email-btn">이메일로 회원가입</button>

          <button className="login-btn">로그인</button>

          <a href="/find-password" className="find-link">
            아이디/비밀번호 찾기
          </a>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
