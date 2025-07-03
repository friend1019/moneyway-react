import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import Header from "../Header";
import logoWallet from "../../images/login/logoWallet.svg";
import "../../css/login/Signin.css";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");

    // 비밀번호 입력 변경 핸들러
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError("");
        setConfirmError("");
    };

    // 비밀번호 확인 입력 변경 핸들러
    const handleConfirmChange = (e) => {
        setPasswordConfirm(e.target.value);
        setConfirmError("");
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        let valid = true;

        // 1. 비밀번호 8자리 이상 체크
        if (password.length < 8) {
            setPasswordError("비밀번호는 8자 이상이어야 합니다.");
            valid = false;
        }

        // 2. 비밀번호 일치 여부 체크
        if (password !== passwordConfirm) {
            setConfirmError("비밀번호가 일치하지 않습니다.");
            valid = false;
        }

        if (!valid) return;

        // TODO: 실제 비밀번호 재설정 API 호출 및 후처리
        alert("비밀번호가 성공적으로 재설정되었습니다.");

        navigate("/login");
    };

    // 제출 가능 여부 (두 칸 모두 1자 이상 입력됐을 때)
    const canSubmit = password.length > 0 && passwordConfirm.length > 0;

    return (
        <>
            <Header />
            <div className="container">
                <div className="forgot-pwd-header">
                    <img src={logoWallet} alt="Wallet Logo" className="wallet-logo" style={{marginBottom:"5rem"}} />
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

                        <button
                            type="submit"
                            className="btn-login"
                            disabled={!canSubmit}
                        >
                            비밀번호 재설정
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;