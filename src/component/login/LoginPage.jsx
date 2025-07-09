//로그인 진입 페이지
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/login/LoginPage.css";
import LoginHeader from "./LoginHeader";
import Header from "../Header";

import kakaoIcon from "../../images/login/kakaoAuth.svg";
import googleIcon from "../../images/login/googleAuth.svg";

const LoginPage = () => {
  const navigate = useNavigate();

  //카카오 로그인
  const handleKakaoLogin = () => {
    window.location.href =
      "https://moneyway-3zca.onrender.com/oauth2/authorization/kakao"; // 백엔드 카카오 로그인 URL
  };

  const goSignup = () => {
    navigate("/signup");
  };

  const goSignin = () => {
    navigate("/signin");
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-header">
          <LoginHeader text="가입" />
        </div>
        <div className="auth-container">
          <div className="auth-header">간편가입 하기 😎</div>

          <div className="social-buttons">
            {/* 카카오 로그인 버튼 */}
            <button className="social-btn kakao-btn" onClick={handleKakaoLogin}>
              <img
                src={kakaoIcon}
                alt="카카오 로그인"
                style={{
                  width: "5.6rem",
                  height: "5.6rem",
                  objectFit: "contain",
                }}
              />
            </button>

            {/* (향후) 구글 로그인 버튼 - 아직 구현 안 됐으면 제외 가능 */}
            <button
              className="social-btn google-btn"
              onClick={() => alert("준비 중입니다!")}
            >
              <img
                src={googleIcon}
                alt="구글 로그인"
                style={{ width: "8rem", height: "8rem", objectFit: "contain" }}
              />
            </button>
          </div>

          <button className="email-btn" onClick={goSignup}>
            이메일로 회원가입
          </button>

          <button className="login-btn" onClick={goSignin}>
            로그인
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
