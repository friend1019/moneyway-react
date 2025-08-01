import React, { useState } from "react";
import Header from "../common/Header";
import Profile from "./Profile";
import ProfileChange from "./ProfileChange";
import MyArticles from "./MyArticles";
import Scrap from "./Scarp";
import Footer from "../common/Footer";
import "../../css/mypage/MyPage.css";

const MyPage = () => {
  const [view, setView] = useState("scrap"); // 🔄 초기값을 scrap으로 설정

  const isEdit = view === "edit";

  return (
    <>
      <Header />

      {isEdit ? (
        <ProfileChange onBack={() => setView("scrap")} />
      ) : (
        <>
          <div className="profile-container">
            <Profile onEditClick={() => setView("edit")} />
          </div>

          <div className="main-container">
            <div className="nav-bar">
              <button onClick={() => setView("scrap")}>스크랩 목록</button>
              <button onClick={() => setView("posts")}>내가 쓴 글</button>
\            </div>

            <div className="sub-container">
              {view === "scrap" && <Scrap />}
              {view === "posts" && <MyArticles />}
            </div>
          </div>
        </>
      )}

      <Footer />
    </>
  );
};

export default MyPage;
