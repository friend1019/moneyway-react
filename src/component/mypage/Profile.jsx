import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import api from "../../api/axios";
import useAuthStore from "../../api/authStore";
import "../../css/mypage/Profile.css";
import LoadingSpinner from "../common/LoadingSpinner";

const Profile = ({ onEditClick }) => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const { clearAccessToken } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/mypage/me");
        console.log("🎯 유저 정보 응답:", res.data);

        setUserInfo(res.data);
      } catch (err) {
        const message =
          err.response?.data?.message || "인증 오류가 발생했습니다.";
        console.error("내 정보 불러오기 실패:", err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("로그아웃 API 실패:", err);
    } finally {
      clearAccessToken();
      toast.success("로그아웃 되었습니다.");
      navigate("/");
    }
  };

  if (!userInfo) return <LoadingSpinner />

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
