import React, { useState } from "react";
import LoginHeader from "./LoginHeader";
import Header from "../Header";
import "../../css/login/Signin.css";
import "../../css/login/Signup.css";
import "../../css/login/LoginPage.css";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  // 이메일 유효성 검사
  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
    setLoginError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
    setLoginError("");
  };

  // 로그인 버튼 활성화 조건
  const canSubmit =
    validateEmail(email) && password.length >= 8;

  // 로그인 처리 함수 (테스트용 모의)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!validateEmail(email)) {
      setEmailError("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    if (password.length < 8) {
      setPasswordError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    // 실제 API 호출 코드 자리
    // 예시: const res = await axios.post('/api/login', { email, password });

    // 테스트용 임시: 계정 없다고 가정
    const accountExists = false;

    if (!accountExists) {
      setLoginError("존재하지 않는 계정입니다.");
      return;
    }

    // 로그인 성공 후 처리 (리다이렉트 등)
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="login-header">
          <LoginHeader text="로그인" />
        </div>
        <div className="login-form">
          <form onSubmit={handleLogin}>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="moneyway@gmail.com"
              className={`input-field ${emailError || loginError ? "error" : ""}`}
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="error-message">{emailError}</p>}

            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="8자리 이상"
              className={`input-field ${passwordError || loginError ? "error" : ""}`}
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}

            {/* 로그인 실패 시 공통 에러 메시지 */}
            {loginError && !emailError && !passwordError && (
              <p className="error-message">{loginError}</p>
            )}

            <button type="submit" className="btn-login" disabled={!canSubmit}>
              로그인
            </button>
          </form>

          <a href="/forgot-pwd" className="find-password-link">
            비밀번호 찾기
          </a>
        </div>
      </div>
    </>
  );
};

export default Signin;


// import React, { useState } from "react";
// import axios from "axios"; // axios 임포트
// import LoginHeader from "./LoginHeader";
// import Header from "../Header";
// import "../../css/login/Signin.css";
// import "../../css/login/Signup.css";
// import "../../css/login/LoginPage.css";

// const Signin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [emailError, setEmailError] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   const [loginError, setLoginError] = useState("");

//   const validateEmail = (email) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//     setEmailError("");
//     setLoginError("");
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//     setPasswordError("");
//     setLoginError("");
//   };

//   const canSubmit =
//     validateEmail(email) && password.length >= 8;

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoginError("");

//     if (!validateEmail(email)) {
//       setEmailError("올바른 이메일 형식을 입력해주세요.");
//       return;
//     }
//     if (password.length < 8) {
//       setPasswordError("비밀번호는 8자 이상이어야 합니다.");
//       return;
//     }

//     try {
//       await axios.post("/api/login", {
//         email,
//         password,
//       });

//       // 성공 처리: 예를 들어, 토큰 저장, 페이지 이동 등
//       // console.log(response.data);
//       alert("로그인 성공!");
//       // 예: window.location.href = "/dashboard";

//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         setLoginError("존재하지 않는 계정이거나 비밀번호가 틀렸습니다.");
//       } else {
//         setLoginError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
//       }
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="container">
//         <div className="login-header">
//           <LoginHeader text="로그인" />
//         </div>
//         <div className="login-form">
//           <form onSubmit={handleLogin}>
//             <label htmlFor="email">이메일</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               placeholder="moneyway@gmail.com"
//               className={`input-field ${emailError || loginError ? "error" : ""}`}
//               value={email}
//               onChange={handleEmailChange}
//             />
//             {emailError && <p className="error-message">{emailError}</p>}

//             <label htmlFor="password">비밀번호</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="8자리 이상"
//               className={`input-field ${passwordError || loginError ? "error" : ""}`}
//               value={password}
//               onChange={handlePasswordChange}
//             />
//             {passwordError && <p className="error-message">{passwordError}</p>}

//             {loginError && !emailError && !passwordError && (
//               <p className="error-message">{loginError}</p>
//             )}

//             <button type="submit" className="btn-login" disabled={!canSubmit}>
//               로그인
//             </button>
//           </form>

//           <a href="/forgot-pwd" className="find-password-link">
//             비밀번호 찾기
//           </a>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Signin;
