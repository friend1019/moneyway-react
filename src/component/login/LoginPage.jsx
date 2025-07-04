<<<<<<< HEAD
=======
//로그인 진입 페이지
>>>>>>> 8d3d8cb (메인페이지)
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/login/LoginPage.css";
import LoginHeader from "./LoginHeader";
<<<<<<< HEAD
import Header from "../Header.jsx";
=======
import Header from "../Header";
>>>>>>> 8d3d8cb (메인페이지)

import kakaoIcon from "../../images/login/kakaoAuth.svg";
import googleIcon from "../../images/login/googleAuth.svg";

const LoginPage = () => {
  const navigate = useNavigate();

  //카카오 로그인
  const handleKakaoLogin = () => {
    window.location.href =
      "http://192.168.208.20:8081/oauth2/authorization/kakao"; // 백엔드 카카오 로그인 URL
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
      <div className="container">
        <div className="login-header">
<<<<<<< HEAD
          <LoginHeader />
=======
          <LoginHeader text="가입" />
>>>>>>> 8d3d8cb (메인페이지)
        </div>
        <div className="auth-container">
          <div className="auth-header">간편가입 하기 😎</div>

          <div className="social-buttons">
            <button className="social-btn kakao-btn">
              <img
                src={kakaoIcon}
                alt="카카오 로그인"
                style={{ width: "5.6rem", height: "5.6rem", objectFit: "contain" }}
              />
            </button>
            <button
              className="social-btn google-btn"
              onClick={handleKakaoLogin}
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
