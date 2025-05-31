import React from "react";
import Header from "../Header";

const MyPage = () => {

  const avatarUrl = "/path/to/avatar.png";
  const username = "주예원";
  const followers = 72;
  const following = 100;
  const intro = "소개글을 입력하세요.";

  return (
    <>
      <Header />
      <div className="container">
        {/* 1. 배너 영역 */}
        <div className="banner">
          {/* 배경색이나 배너 이미지를 CSS로 설정 */}
        </div>

        {/* 2. 프로필 요약 영역 */}
        <div className="profile">
          <div className="avatar">
            <img src={avatarUrl} alt="프로필 사진" />
          </div>
          <div className="info">
            <h1 className="name">{username}</h1>
            <div className="stats">
              <span>팔로워 {followers}</span>
              <span className="separator">|</span>
              <span>팔로잉 {following}</span>
            </div>
            <p className="intro">{intro}</p>
          </div>
        </div>

        {/* 3. 탭 네비게이션 */}
        <div className="tabs">
          <button className="tab tab--active">나의 로그</button>
          <button className="tab">내가 좋아한 글</button>
          <button className="tab">내 여행 리스트</button>
        </div>

        {/* 4. 콘텐츠 영역 */}
        <div className="content">
          {/* 비어 있을 때 보여줄 빈 상태(Empty State) */}
          <div className="empty-state">
            <p className="empty-state__text">
              기록을 남기고 추억을 공유해보세요
            </p>
            <button className="empty-state__button">첫 로그 작성하기</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default MyPage;