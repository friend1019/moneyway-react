import "../../css/main/main.css";

import Header from "../header";
import background from "../../images/main/background.png";

function Main() {
  return (
    <div className="main">
        <Header />
      <div className="main-container">
        <img
          src={background}
          alt="background"
          className="background-container"
        />

        <div className="second-banner"></div>
      </div>
    </div>
  );
}
export default Main;
