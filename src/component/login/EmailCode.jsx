import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Header from "../Header";
import logoWallet from "../../images/login/logoWallet.svg";

const EmailCode = () => {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (/^[0-9]?$/.test(val)) {
      const newCode = [...code];
      newCode[index] = val;
      setCode(newCode);
      if (val && index < 4) {
        inputsRef.current[index + 1].focus();
      }
      setError("");
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("이메일 정보가 없습니다. 이전 단계부터 다시 시작해주세요.");
      return;
    }

    const joinedCode = code.join("");
    if (joinedCode.length < 5) {
      setError("5자리 인증코드를 모두 입력해주세요.");
      return;
    }

    try {
      const res = await api.post("/users/password/verify-code", {
        email,
        code: joinedCode,
      });

      if (res.data.success) {
        alert("인증 완료! 비밀번호를 재설정해주세요.");
        navigate("/reset-password", { state: { email } });
      } else {
        setError("인증에 실패했습니다. 코드를 다시 확인해주세요.");
      }
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === "INVALID_VERIFICATION_CODE") {
        setError("인증코드가 올바르지 않습니다.");
      } else if (code === "VERIFICATION_CODE_EXPIRED") {
        setError("인증코드가 만료되었습니다. 다시 요청해주세요.");
      } else {
        setError("서버 오류가 발생했습니다.");
      }
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="forgot-pwd-header">
          <img src={logoWallet} alt="Wallet Logo" className="wallet-logo" />
          <h1 style={{ fontSize: "3.6rem", fontWeight: "bold" }}>
            비밀번호 재설정 코드를 입력하세요.
          </h1>
          <p style={{ fontSize: "1.6rem", marginTop: 0 }}>
            이메일이 오지 않았다면 스팸함을 확인해주세요.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          className="code-box-container"
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            marginTop: "20rem",
          }}
        >
          {code.map((char, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={char}
              onChange={(e) => handleChange(idx, e)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              ref={(el) => (inputsRef.current[idx] = el)}
              style={{
                width: "10rem",
                height: "10rem",
                fontSize: "6rem",
                textAlign: "center",
                borderRadius: "0.8rem",
                border: "1.5px solid #aaa",
                outline: "none",
              }}
            />
          ))}
        </div>

        {error && (
          <p style={{ color: "red", textAlign: "center", marginTop: "2rem", fontSize: "1.4rem" }}>
            {error}
          </p>
        )}

        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <button type="submit" className="btn-login">
            인증코드 확인
          </button>
        </div>
      </form>
    </>
  );
};

export default EmailCode;
