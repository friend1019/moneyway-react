import React from "react";
import "../../css/common/LoadingSpinner.css";
import LogoWallet from "../../images/login/logoWallet.svg";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <img src={LogoWallet} alt="로딩 중" className="loading-spinner" />
    </div>
  );
};

export default LoadingSpinner;
