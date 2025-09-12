import React from "react";
import "../../css/aiplan/Loader.css"; // CSS 따로 관리

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="typewriter">
        <div className="slide">
          <i />
        </div>
        <div className="paper" />
        <div className="keyboard" />
      </div>
    </div>
  );
};

export default Loader;
