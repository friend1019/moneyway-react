import React, { useState, useRef } from "react";
import Header from "../Header";
import logoWallet from "../../images/login/logoWallet.svg";

const EmailCode = () => {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (/^[0-9]?$/.test(val)) { // 숫자 한 글자만 허용
      const newCode = [...code];
      newCode[index] = val;
      setCode(newCode);
      if (val && index < 4) {
        inputsRef.current[index + 1].focus(); // 다음 input으로 포커스 이동
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus(); // 빈칸에서 백스페이스 누르면 이전 칸으로
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="forgot-pwd-header">
          <img src={logoWallet} alt="Wallet Logo" className="wallet-logo" />
          <h1 style={{ fontSize: "3.6rem", fontWeight: "bold" }}>
            비밀번호 재설정 코드를 입력하세요.
          </h1>
          <p style={{ fontSize: "1.6rem", marginTop: 0 }}>
            이메일이 오지 않았다면 스팸을 드세요.
          </p>
        </div>
      </div>

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
    </>
  );
};

export default EmailCode;
