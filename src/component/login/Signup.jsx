import React, { useState } from "react";
import Header from "../Header";
import signupImage from "../../images/login/signup.svg";

import "../../css/login/Signup.css";

function Signup() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 중복확인 성공 상태
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);

  // 중복확인 성공 시점의 값 저장
  const [nicknameCheckedValue, setNicknameCheckedValue] = useState("");
  const [emailCheckedValue, setEmailCheckedValue] = useState("");

  // 에러 및 성공 메시지 상태
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [nicknameSuccess, setNicknameSuccess] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // 유효성 검사 함수들
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateNickname = (nickname) => nickname.trim().length >= 3;
  const validatePassword = (pwd) => pwd.length >= 8;

  // 닉네임 입력 변경 시
  const handleNicknameChange = (e) => {
    const val = e.target.value;

    // 현재 입력이 중복확인 성공 시점 값과 다르면 중복확인 상태 초기화
    if (val !== nicknameCheckedValue) {
      setNicknameChecked(false);
      setNicknameCheckedValue("");
      setNicknameSuccess("");
    }

    setNickname(val);
    setNicknameError("");
  };

  // 이메일 입력 변경 시
  const handleEmailChange = (e) => {
    const val = e.target.value;

    if (val !== emailCheckedValue) {
      setEmailChecked(false);
      setEmailCheckedValue("");
      setEmailSuccess("");
    }

    setEmail(val);
    setEmailError("");
  };

  // 비밀번호 입력 변경 시
  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (validatePassword(val)) {
      setPasswordError("");
    } else {
      setPasswordError("비밀번호는 8자 이상이어야 합니다.");
    }
  };

  // 닉네임 중복확인 버튼 클릭 시
  const handleNicknameCheck = () => {
    if (!validateNickname(nickname)) {
      setNicknameError("3자리 이상 입력해주세요.");
      setNicknameChecked(false);
      setNicknameSuccess("");
      return;
    }

    // 실제 중복 검사 API 호출 결과로 대체하세요
    const isDuplicate = false;

    if (isDuplicate) {
      setNicknameError("중복된 닉네임입니다.");
      setNicknameChecked(false);
      setNicknameSuccess("");
    } else {
      setNicknameError("");
      setNicknameChecked(true);
      setNicknameSuccess("사용 가능한 닉네임입니다.");
      setNicknameCheckedValue(nickname); // 성공한 값 저장
    }
  };

  // 이메일 중복확인 버튼 클릭 시
  const handleEmailCheck = () => {
    if (!validateEmail(email)) {
      setEmailError("올바른 이메일 형식을 입력해주세요.");
      setEmailChecked(false);
      setEmailSuccess("");
      return;
    }

    // 실제 중복 검사 API 호출 결과로 대체하세요
    const isDuplicate = false;

    if (isDuplicate) {
      setEmailError("중복된 이메일입니다.");
      setEmailChecked(false);
      setEmailSuccess("");
    } else {
      setEmailError("");
      setEmailChecked(true);
      setEmailSuccess("사용 가능한 이메일입니다.");
      setEmailCheckedValue(email); // 성공한 값 저장
    }
  };

  return (
    <>
      <div className="header">
        <Header />
      </div>
      <div className="signup-container">
        <div className="signup-image">
          <img src={signupImage} alt="Signup Illustration" />
        </div>

        <div className="signup-form">
          <h1>MoneyWay 가입하기</h1>
          <div className="input-form">
            <form>
              {/* 닉네임 */}
              <label htmlFor="nickname">닉네임</label>
              <div className="input-row">
                <input
                  className={`input-field ${
                    nicknameChecked ? "checked" : ""
                  } ${nicknameError ? "error" : ""} ${
                    nicknameSuccess ? "success" : ""
                  }`}
                  type="text"
                  id="nickname"
                  name="nickname"
                  placeholder="3자리 이상"
                  value={nickname}
                  onChange={handleNicknameChange}
                />
                <button
                  type="button"
                  className={`btn-check ${
                    nicknameChecked && nickname.length > 0 ? "active" : ""
                  }`}
                  onClick={handleNicknameCheck}
                  disabled={nickname.length === 0}
                >
                  중복확인
                </button>
              </div>
              {nicknameError && <p className="error-message">{nicknameError}</p>}
              {!nicknameError && nicknameSuccess && (
                <p className="success-message">{nicknameSuccess}</p>
              )}

              {/* 이메일 */}
              <label htmlFor="email">이메일</label>
              <div className="input-row">
                <input
                  className={`input-field ${
                    emailChecked ? "checked" : ""
                  } ${emailError ? "error" : ""} ${emailSuccess ? "success" : ""}`}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="moneyway@gmail.com"
                  value={email}
                  onChange={handleEmailChange}
                />
                <button
                  type="button"
                  className={`btn-check ${
                    emailChecked && email.length > 0 ? "active" : ""
                  }`}
                  onClick={handleEmailCheck}
                  disabled={email.length === 0}
                >
                  중복확인
                </button>
              </div>
              {emailError && <p className="error-message">{emailError}</p>}
              {!emailError && emailSuccess && (
                <p className="success-message">{emailSuccess}</p>
              )}

              {/* 비밀번호 */}
              <label htmlFor="password">비밀번호</label>
              <div className="input-row">
                <input
                  className={`input-field ${passwordError ? "error" : ""}`}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="8자리 이상"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              {passwordError && <p className="error-message">{passwordError}</p>}

              {/* 가입하기 버튼 */}
              <button
                type="submit"
                className="btn-submit"
                disabled={!(nicknameChecked && emailChecked && password.length >= 8)}
              >
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


// import React, { useState } from "react";
// import axios from "axios";
// import Header from "../Header";
// import signupImage from "../../images/login/signup2.svg";

// import "../../css/login/Signup.css";

// function Signup() {
//   const [nickname, setNickname] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [nicknameChecked, setNicknameChecked] = useState(false);
//   const [emailChecked, setEmailChecked] = useState(false);

//   const [nicknameCheckedValue, setNicknameCheckedValue] = useState("");
//   const [emailCheckedValue, setEmailCheckedValue] = useState("");

//   const [nicknameError, setNicknameError] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [passwordError, setPasswordError] = useState("");

//   const [nicknameSuccess, setNicknameSuccess] = useState("");
//   const [emailSuccess, setEmailSuccess] = useState("");

//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const validateNickname = (nickname) => nickname.trim().length >= 3;
//   const validatePassword = (pwd) => pwd.length >= 8;

//   const handleNicknameChange = (e) => {
//     const val = e.target.value;
//     if (val !== nicknameCheckedValue) {
//       setNicknameChecked(false);
//       setNicknameCheckedValue("");
//       setNicknameSuccess("");
//     }
//     setNickname(val);
//     setNicknameError("");
//   };

//   const handleEmailChange = (e) => {
//     const val = e.target.value;
//     if (val !== emailCheckedValue) {
//       setEmailChecked(false);
//       setEmailCheckedValue("");
//       setEmailSuccess("");
//     }
//     setEmail(val);
//     setEmailError("");
//   };

//   const handlePasswordChange = (e) => {
//     const val = e.target.value;
//     setPassword(val);
//     if (validatePassword(val)) {
//       setPasswordError("");
//     } else {
//       setPasswordError("비밀번호는 8자 이상이어야 합니다.");
//     }
//   };

//   // 닉네임 중복검사 API 호출
//   const handleNicknameCheck = async () => {
//     if (!validateNickname(nickname)) {
//       setNicknameError("3자리 이상 입력해주세요.");
//       setNicknameChecked(false);
//       setNicknameSuccess("");
//       return;
//     }

//     try {
//       const response = await axios.post("/api/nickname", { nickname });
//       // 예시: { available: true } 형식 가정
//       if (response.data.available) {
//         setNicknameError("");
//         setNicknameChecked(true);
//         setNicknameSuccess("사용 가능한 닉네임입니다.");
//         setNicknameCheckedValue(nickname);
//       } else {
//         setNicknameError("중복된 닉네임입니다.");
//         setNicknameChecked(false);
//         setNicknameSuccess("");
//       }
//     } catch (error) {
//       setNicknameError("서버 오류가 발생했습니다.");
//       setNicknameChecked(false);
//       setNicknameSuccess("");
//       console.error(error);
//     }
//   };

//   // 이메일 중복검사 API 호출
//   const handleEmailCheck = async () => {
//     if (!validateEmail(email)) {
//       setEmailError("올바른 이메일 형식을 입력해주세요.");
//       setEmailChecked(false);
//       setEmailSuccess("");
//       return;
//     }

//     try {
//       const response = await axios.post("/api/email", { email });
//       // 예시: { available: true } 형식 가정
//       if (response.data.available) {
//         setEmailError("");
//         setEmailChecked(true);
//         setEmailSuccess("사용 가능한 이메일입니다.");
//         setEmailCheckedValue(email);
//       } else {
//         setEmailError("중복된 이메일입니다.");
//         setEmailChecked(false);
//         setEmailSuccess("");
//       }
//     } catch (error) {
//       setEmailError("서버 오류가 발생했습니다.");
//       setEmailChecked(false);
//       setEmailSuccess("");
//       console.error(error);
//     }
//   };

//   // 회원가입 API 호출
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!(nicknameChecked && emailChecked && validatePassword(password))) {
//       alert("입력 정보를 확인해주세요.");
//       return;
//     }

//     try {
//       await axios.post("/api/signup", {
//         nickname,
//         email,
//         password,
//       });

//       // 성공 처리 예시
//       alert("회원가입이 완료되었습니다.");
//       // 필요하면 리다이렉트 등 처리
//     } catch (error) {
//       alert("회원가입 중 오류가 발생했습니다.");
//       console.error(error);
//     }
//   };

//   return (
//     <>
//       <div className="header">
//         <Header />
//       </div>
//       <div className="signup-container">
//         <div className="signup-image">
//           <img src={signupImage} alt="Signup Illustration" />
//         </div>

//         <div className="signup-form">
//           <h1>MoneyWay 가입하기</h1>
//           <div className="input-form">
//             <form onSubmit={handleSubmit}>
//               {/* 닉네임 */}
//               <label htmlFor="nickname">닉네임</label>
//               <div className="input-row">
//                 <input
//                   className={`input-field ${
//                     nicknameChecked ? "checked" : ""
//                   } ${nicknameError ? "error" : ""} ${
//                     nicknameSuccess ? "success" : ""
//                   }`}
//                   type="text"
//                   id="nickname"
//                   name="nickname"
//                   placeholder="3자리리 이상"
//                   value={nickname}
//                   onChange={handleNicknameChange}
//                 />
//                 <button
//                   type="button"
//                   className={`btn-check ${
//                     nicknameChecked && nickname.length > 0 ? "active" : ""
//                   }`}
//                   onClick={handleNicknameCheck}
//                   disabled={nickname.length === 0}
//                 >
//                   중복확인
//                 </button>
//               </div>
//               {nicknameError && <p className="error-message">{nicknameError}</p>}
//               {!nicknameError && nicknameSuccess && (
//                 <p className="success-message">{nicknameSuccess}</p>
//               )}

//               {/* 이메일 */}
//               <label htmlFor="email">이메일</label>
//               <div className="input-row">
//                 <input
//                   className={`input-field ${
//                     emailChecked ? "checked" : ""
//                   } ${emailError ? "error" : ""} ${emailSuccess ? "success" : ""}`}
//                   type="email"
//                   id="email"
//                   name="email"
//                   placeholder="moneyway@gmail.com"
//                   value={email}
//                   onChange={handleEmailChange}
//                 />
//                 <button
//                   type="button"
//                   className={`btn-check ${
//                     emailChecked && email.length > 0 ? "active" : ""
//                   }`}
//                   onClick={handleEmailCheck}
//                   disabled={email.length === 0}
//                 >
//                   중복확인
//                 </button>
//               </div>
//               {emailError && <p className="error-message">{emailError}</p>}
//               {!emailError && emailSuccess && (
//                 <p className="success-message">{emailSuccess}</p>
//               )}

//               {/* 비밀번호 */}
//               <label htmlFor="password">비밀번호</label>
//               <div className="input-row">
//                 <input
//                   className={`input-field ${passwordError ? "error" : ""}`}
//                   type="password"
//                   id="password"
//                   name="password"
//                   placeholder="8자리 이상"
//                   value={password}
//                   onChange={handlePasswordChange}
//                 />
//               </div>
//               {passwordError && <p className="error-message">{passwordError}</p>}

//               {/* 가입하기 버튼 */}
//               <button
//                 type="submit"
//                 className="btn-submit"
//                 disabled={!(nicknameChecked && emailChecked && validatePassword(password))}
//               >
//                 가입하기
//               </button>
//             </form>
//           </div>
//           <p className="login-link">
//             이미 계정이 있으신가요? <a href="/login">로그인</a>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Signup;
