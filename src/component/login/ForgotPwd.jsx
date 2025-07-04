<<<<<<< HEAD
import React from "react";
import Header from "../Header.jsx";
import "../../css/login/Signin.css";
import "../../css/login/LoginPage.css";
=======
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header";
>>>>>>> 8d3d8cb (메인페이지)
import "../../css/login/ForgotPwd.css";
import logoWallet from "../../images/login/logoWallet.svg";

const ForgotPwd = () => {
<<<<<<< HEAD
=======
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
    setGeneralError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setGeneralError("");

    try {
      const response = await axios.post("/api/forgot-password", { email });

      if (response.data.exists === false) {
        setGeneralError("가입된 계정이 없습니다.");
      } else {
        alert("비밀번호 재설정 코드가 이메일로 발송되었습니다.");
        navigate("/emailcode");
      }
    } catch (error) {
      setGeneralError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

>>>>>>> 8d3d8cb (메인페이지)
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
<<<<<<< HEAD
          <form>
=======
          <form onSubmit={handleSubmit}>
>>>>>>> 8d3d8cb (메인페이지)
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="moneyway@gmail.com"
<<<<<<< HEAD
              className="input-field"
            />
            <button type="submit" className="btn-emailcode" disabled>
=======
              className={`input-field ${emailError || generalError ? "error" : ""}`}
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="error-message">{emailError}</p>}
            {generalError && !emailError && (
              <p className="error-message">{generalError}</p>
            )}
            <button type="submit" className="btn-emailcode" disabled={isSubmitting}>
>>>>>>> 8d3d8cb (메인페이지)
              이메일로 코드 받기
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
<<<<<<< HEAD
=======

>>>>>>> 8d3d8cb (메인페이지)
export default ForgotPwd;
