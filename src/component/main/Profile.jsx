import '../../css/main/Profile.css';
import { MdEdit } from 'react-icons/md';

const Profile = ({ onEditClick }) => {
    return (
        <div className="container">
            <div className="profile-image">
                {/* 이미지 삽입 */}
            </div>
            <div className="nickname">
                <p>땡땡이</p>
            </div>
            <div className="info-fix">
                <button onClick={onEditClick}>
                    정보 편집 <MdEdit />
                </button>
            </div>
            <div className="logout-btn">
                <button>로그아웃</button>
            </div>
        </div>
    );
};

export default Profile;
