import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import api from "../../api/axios";
import "../../css/main/Profile.css";

const Profile = ({ onEditClick }) => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/mypage/me");
        setUserInfo(res.data);
      } catch (err) {
        console.error("내 정보 불러오기 실패", err);
        alert("로그인이 만료되었거나 인증 정보가 없습니다.");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    // 필요 시 서버에 로그아웃 요청 추가 가능
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  if (!userInfo) return <p className="loading">로딩 중...</p>;

  return (
    <div className="profilecard-container">
      <div className="profile-image">
        {userInfo.profileImageUrl ? (
          <img src={userInfo.profileImageUrl} alt="프로필 이미지" />
        ) : (
          <div className="placeholder-image">👤</div>
        )}
      </div>
      <div className="nickname">
        <p>{userInfo.nickname}</p>
      </div>
      <div className="info-fix">
        <button onClick={onEditClick}>
          정보 편집 <MdEdit />
        </button>
      </div>
      <div className="logout-btn">
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    </div>
  );
};

export default Profile;
