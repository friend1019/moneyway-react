//비밀번호 찾기 창
import React from "react";
import Header from "../Header";
import "../../css/login/Signin.css";
import "../../css/login/LoginPage.css";
import "../../css/login/ForgotPwd.css";
import logoWallet from "../../images/login/logoWallet.svg";

const ForgotPwd = () => {
  return (
    <>
      <Header />
      <div className="container">
        <div className="forgot-pwd-header">
          <img src={logoWallet} alt="Wallet Logo" className="wallet-logo" />
          <h1 style={{ fontSize: "3.6rem", fontWeight: "bold" }}>
            비밀번호를 잊으셨나요?
          </h1>
          <p style={{ fontSize: "1.6rem", marginTop: "0" }}>
            이메일을 입력하고 비밀번호 재설정 코드를 받으세요.
          </p>
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
            <button type="submit" className="btn-emailcode" disabled>
              이메일로 코드 받기
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default ForgotPwd;
