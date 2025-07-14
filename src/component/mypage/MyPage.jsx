import React, { useState } from "react";
import Header from "../common/Header";
import Profile from "./Profile";
import ProfileChange from "./ProfileChange";
import MyArticles from "./MyArticles";
import Scrap from "./Scarp";
import '../../css/mypage/MyPage.css';

const MyPage = () => {
  const [view, setView] = useState("default");
  const isEdit = view === "edit";

  return (
    <>
      <Header />
      <div className={`main-container ${isEdit ? "edit-mode" : ""}`}>
        {!isEdit && (
          <div className="nav-bar">
            <button onClick={() => setView("scrap")}>스크랩 목록</button>
            <button onClick={() => setView("posts")}>내가 쓴 글</button>
          </div>
        )}

        <div className="profile-container">
          <Profile onEditClick={() => setView("edit")} />
        </div>

        <div className="sub-container">
          {view === "scrap" && <Scrap />}
          {view === "posts" && <MyArticles />}
          {view === "edit" && <ProfileChange />}
        </div>
      </div>
    </>
  );
};

export default MyPage;
