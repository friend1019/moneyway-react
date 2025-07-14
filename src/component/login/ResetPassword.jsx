import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import Header from "../common/Header";
import logoWallet from "../../images/login/logoWallet.svg";
import "../../css/login/ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    // location.state에 email이 없고, 로그인 상태라면 /user/me로 이메일 조회
    if (!email) {
      (async () => {
        try {
          const res = await api.get("/mypage/me");
          if (res.data && res.data.email) {
            setEmail(res.data.email);
          }
        } catch (err) {
          // 로그인 상태가 아니면 무시 (비로그인 비번재설정 플로우)
        }
      })();
    }
  }, [email]);

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

    // 이메일이 없으면 마이페이지(로그인) 비밀번호 변경, 있으면 비밀번호 재설정
    if (!email && !window.location.pathname.includes('mypage')) {
      setGeneralError("이메일 정보가 없습니다. 인증부터 다시 진행해주세요.");
      valid = false;
    }

    if (!valid) return;

    try {
      let res;
      if (email) {
        // 비밀번호 재설정(이메일 인증 플로우)
        res = await api.patch("/users/password/reset", {
          email: email,
          newPassword: password,
        });
      } else {
        // 마이페이지 비밀번호 변경(로그인 상태)
        res = await api.patch("/mypage/password", {
          currentPassword: passwordConfirm, // 기존 비밀번호 입력란이 따로 있다면 수정 필요
          newPassword: password,
        });
      }

      console.log("📦 서버 응답:", res.data);

      if (res.data.message && res.data.message.includes("성공")) {
        toast.success(
          res.data.message || "비밀번호가 성공적으로 변경되었습니다."
        );
        navigate("/login");
      } else {
        toast.error(res.data.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "비밀번호 변경 중 오류가 발생했습니다.";
      setGeneralError(message);
      console.error("❌ 서버 에러:", err.response?.data || err);
    }
  };

  const canSubmit = password.length > 0 && passwordConfirm.length > 0;

  return (
    <>
      <Header />
      <div className="reset-password-container">
        <div className="reset-password-header">
          <img
            src={logoWallet}
            alt="Wallet Logo"
            className="wallet-logo"
            style={{ marginBottom: "5rem" }}
          />
        </div>
        <div className="reset-password-form">
          <form onSubmit={handleResetPassword}>
            <label htmlFor="password">새 비밀번호 입력</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="8자리 이상"
              className={`reset-input-field ${passwordError ? "error" : ""}`}
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
              className={`reset-input-field ${confirmError ? "error" : ""}`}
              value={passwordConfirm}
              onChange={handleConfirmChange}
            />
            {confirmError && <p className="error-message">{confirmError}</p>}

            {generalError && <p className="error-message">{generalError}</p>}

            <button type="submit" className="reset-btn" disabled={!canSubmit}>
              비밀번호 재설정
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;