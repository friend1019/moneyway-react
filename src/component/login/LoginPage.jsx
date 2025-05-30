import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/login/LoginPage.css";

import kakaoIcon from "../../images/kakaoAuth.svg";
import googleIcon from "../../images/googleAuth.svg";

const LoginPage = () => {
  //카카오 로그인
  const handleKakaoLogin = () => {
    window.location.href =
      "http://192.168.208.20:8081/oauth2/authorization/kakao"; // 백엔드 카카오 로그인 URL
  };

  return (
    <div className="auth-container">
      <div className="auth-header">간편가입 하기 😎</div>

      <div className="social-buttons">
        <button className="social-btn kakao-btn">
          <img
            src={kakaoIcon}
            alt="카카오 로그인"
            style={{ width: "30px", height: "30px", objectFit: "contain" }}
          />
        </button>
        <button className="social-btn google-btn" onClick={handleKakaoLogin}>
          <img
            src={googleIcon}
            alt="구글 로그인"
            style={{ width: "45px", height: "45px", objectFit: "contain" }}
          />
        </button>
      </div>

      <button className="email-btn">이메일로 회원가입</button>

      <button className="login-btn">로그인</button>

      <a href="/find-password" className="find-link">
        아이디/비밀번호 찾기
      </a>
    </div>
  );
};

export default LoginPage;
