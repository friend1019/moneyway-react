import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios"; // ✅ API 연동
import Header from "../common/Header";
import logoWallet from "../../images/login/logoWallet.svg";
import "../../css/login/Signin.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
    setConfirmError("");
    setGeneralError("");
  };

  const handleConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
    setConfirmError("");
    setGeneralError("");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    let valid = true;

    if (!passwordRegex.test(password)) {
      setPasswordError("8~16자, 특수문자(@$!%*?&)를 포함해야 합니다.");
      valid = false;
    }

    if (password !== passwordConfirm) {
      setConfirmError("비밀번호가 일치하지 않습니다.");
      valid = false;
    }

    if (!email) {
      setGeneralError("이메일 정보가 없습니다. 인증부터 다시 진행해주세요.");
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await api.patch("/users/password/reset", {
        email,
        newPassword: password,
      });

      console.log("📦 서버 응답:", res.data);

      if (res.data.code === "SUCCESS") {
        alert(res.data.message || "비밀번호가 성공적으로 재설정되었습니다.");
        navigate("/login");
      } else {
        setGeneralError(res.data.message || "비밀번호 재설정에 실패했습니다.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "비밀번호 재설정 중 오류가 발생했습니다.";
      setGeneralError(message);
      console.error("❌ 서버 에러:", err.response?.data || err);
    }
  };

  const canSubmit = password.length > 0 && passwordConfirm.length > 0;

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="forgot-pwd-header">
          <img
            src={logoWallet}
            alt="Wallet Logo"
            className="wallet-logo"
            style={{ marginBottom: "5rem" }}
          />
        </div>
        <div className="login-form">
          <form onSubmit={handleResetPassword}>
            <label htmlFor="password">새 비밀번호 입력</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="8자리 이상"
              className={`input-field ${passwordError ? "error" : ""}`}
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}

            <label htmlFor="passwordConfirm">새 비밀번호 확인</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              placeholder="비밀번호 확인"
              className={`input-field ${confirmError ? "error" : ""}`}
              value={passwordConfirm}
              onChange={handleConfirmChange}
            />
            {confirmError && <p className="error-message">{confirmError}</p>}

            {generalError && <p className="error-message">{generalError}</p>}

            <button type="submit" className="btn-login" disabled={!canSubmit}>
              비밀번호 재설정
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
