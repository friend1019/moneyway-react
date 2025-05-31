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
      >
        환영합니다!
      </h1>
    </div>
  );
};
export default LoginHeader;
