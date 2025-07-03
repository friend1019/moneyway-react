<<<<<<< HEAD
const LoginHeader = () => {
  return (
    <div className="container">
      <h1
        className="header"
        style={{ marginLeft: 0, fontSize: "4.8rem", fontWeight: "bold" }} // h1 아래 여백 좁히기
      >
        MoneyWay에 가입하세요
      </h1>
      <h1
        className="header2"
        style={{ marginTop: 0, fontSize: "4.8rem", fontWeight: "bold" }} // h2 위 여백 제거
=======
const LoginHeader = ({ text }) => {
  return (
    <div>
      <h1
        className="login=header"
        style={{ marginLeft: 0, fontSize: "4.8rem", fontWeight: "bold" }}
      >
        MoneyWay에 {text}하세요
      </h1>
      <h1
        className="login-header2"
        style={{ marginTop: 0, fontSize: "4.8rem", fontWeight: "bold" }}
>>>>>>> 8d3d8cb (메인페이지)
      >
        환영합니다!
      </h1>
    </div>
  );
};
export default LoginHeader;
