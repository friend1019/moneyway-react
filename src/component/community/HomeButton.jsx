import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";
import "../../css/community/HomeButton.css";

const HomeButton = ({ showBack = false }) => {
  const navigate = useNavigate();

  return (
    <div className="side-nav-wrapper">
      {showBack && (
        <div className="nav-top">
          <button className="side-btn post-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft size={24} />
          </button>
          <div className="top-bar" />
        </div>
      )}
      <div className={`nav-bottom ${showBack ? "with-bg" : ""}`}>
        <button className="side-btn home-btn" onClick={() => navigate("/community")}>
          <FaHome size={24} />
        </button>
      </div>
    </div>
  );
};

export default HomeButton;
