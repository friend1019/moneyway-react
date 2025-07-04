import React, { useState } from "react";
import Header from "../Header";
import Profile from "./Profile";
import ProfileChange from "./ProfileChange";
import '../../css/main/MyPage.css';

const MyPage = () => {
  const [view, setView] = useState('default');

  const isEdit = view === 'edit';

  return (
    <>
      <Header />
      <div className={`main-container ${isEdit ? 'edit-mode' : ''}`}>
        {!isEdit && (
          <div className="nav-bar">
            <button onClick={() => setView('scrap')}>스크랩 목록</button>
            <button onClick={() => setView('posts')}>내가 쓴 글</button>
          </div>
        )}

        <div className="profile-container">
          <Profile onEditClick={() => setView('edit')} />
        </div>

        <div className="sub-container">
          {view === 'scrap' && <div>스크랩 목록 컴포넌트</div>}
          {view === 'posts' && <div>내가 쓴 글 컴포넌트</div>}
          {view === 'edit' && <ProfileChange />}
        </div>
      </div>
    </>
  );
};

export default MyPage;
