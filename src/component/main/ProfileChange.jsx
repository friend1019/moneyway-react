import React, { useState } from 'react';
import '../../css/main/ProfileChange.css';

const ProfileChange = () => {
  const [nickname, setNickname] = useState('땡땡이');
  const [password, setPassword] = useState('');
  const [isChangingPw, setIsChangingPw] = useState(false);

  const handleSave = () => {
    alert('저장 기능은 아직 구현되지 않았습니다.');
  };

  return (
    <div className="profile-change-container">
      <div className="section">
        <label className="label">프로필 사진</label>
        <button className="upload-btn">
          사진 업로드하기 <span className="icon">🔄</span>
        </button>
      </div>

      <div className="section">
        <label className="label">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      <div className="section password-section">
        <label className="label">비밀번호 변경</label>
        <input
          type="password"
          placeholder="8자리 이상"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!isChangingPw}
        />
        <button
          className="change-btn"
          onClick={() => setIsChangingPw(!isChangingPw)}
        >
          변경하기
        </button>
      </div>

      <div className="submit-btn-wrap">
        <button className="save-btn" onClick={handleSave}>
          저장하기
        </button>
      </div>
    </div>
  );
};

export default ProfileChange;
