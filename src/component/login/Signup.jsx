import React from "react";
import Header from "../Header";
import signupImage from "../../images/login/signup.svg"; // 경로 확인 필요

import "../../css/login/Signup.css";

function Signup() {
  return (
    <>
      <Header />

      <div className="signup-container">
        <div className="signup-image">
          <img src={signupImage} alt="Signup Illustration" />
        </div>

        <div className="signup-form">
          <h1>MoneyWay 가입하기</h1>
          <div className="input-form">
            <form>
              <label htmlFor="nickname">닉네임</label>
              <div className="input-row">
                <input
                  className="input-field"
                  type="text"
                  id="nickname"
                  name="nickname"
                  placeholder="머니웨이"
                />
                <button type="button" className="btn-check">
                  중복확인
                </button>
              </div>

              <label htmlFor="email">이메일</label>
              <div className="input-row">
                <input
                  className="input-field"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="moneyway@gmail.com"
                />
                <button type="button" className="btn-check">
                  중복확인
                </button>
              </div>

              <label htmlFor="password">비밀번호</label>
              <div className="input-row">
                <input
                  className="input-field"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="8자 이상"
                />
              </div>

              <button type="submit" className="btn-submit">
                가입하기
              </button>
            </form>
          </div>
          <p className="login-link">
            이미 계정이 있으신가요? <a href="/login">로그인</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
