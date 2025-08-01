import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/community/CommunityMain.css";
import Header from "../common/Header";
import Footer from "../common/Footer";
import PostListForm from "./PostListForm";
import HomeButton from "./HomeButton";

const CommunityMain = () => {
  const [sortOption, setSortOption] = useState("LATEST");
  const [filterOption, setFilterOption] = useState("ALL");
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <HomeButton />
      <div className="community-post-button-wrapper">
        <button
          className="create-post-btn"
          onClick={() => navigate("/posts/create")}
        >
          글 작성하기
        </button>
      </div>
      <div className="community-container">
        <div className="community-header">
          <div className="list-dropdown-group">
            {/* 왼쪽: 타임라인 */}
            <div className="list-dropdown-title">
              <p>타임라인</p>
            </div>

            {/* 오른쪽: 최신순 + 전체보기 */}
            <div className="list-dropdown-right">
              <div className="list-dropdown">
                <button className="list-dropdown-btn">
                  <span className="label">{getSortLabel(sortOption)}</span>
                  <span className="icon">▼</span>
                </button>
                <div className="list-dropdown-menu">
                  <div onClick={() => setSortOption("LATEST")}>최신순</div>
                  <div onClick={() => setSortOption("LIKES")}>좋아요순</div>
                </div>
              </div>

              <div className="list-dropdown">
                <button className="list-dropdown-btn">
                  <span className="label">
                    {filterOption === "ALL" ? "전체보기" : "챌린지 참여"}
                  </span>
                  <span className="icon">▼</span>
                </button>
                <div className="list-dropdown-menu">
                  <div onClick={() => setFilterOption("ALL")}>전체보기</div>
                  <div onClick={() => setFilterOption("CHALLENGE")}>
                    챌린지 참여
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="post-list-container">
          <PostListForm sort={sortOption} filter={filterOption} />
        </div>
      </div>
      <Footer />
    </>
  );
};

const getSortLabel = (value) => {
  switch (value) {
    case "LATEST":
      return "최신순";
    case "LIKES":
      return "좋아요순";
    default:
      return "정렬";
  }
};

export default CommunityMain;
