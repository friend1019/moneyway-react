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
      >
        환영합니다!
      </h1>
    </div>
  );
};
export default LoginHeader;
