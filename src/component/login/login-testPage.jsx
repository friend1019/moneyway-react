import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function loginTestPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const handleLogout = () => {
        // 로그아웃 시 백엔드에서 쿠키 삭제
        api.post('/users/logout', {}, { withCredentials: true }).then(() => {
            localStorage.removeItem('jwt_token'); // 로컬스토리지에서 JWT 토큰 삭제
            navigate('/logintest');  // 로그인 페이지로 이동
        }).catch((err) => {
            console.error('로그아웃 실패:', err);
        });
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me', { withCredentials: true });  // 자동으로 쿠키 전송
                setUser(response.data);  // 사용자 정보 설정
            } catch (error) {
                setUser(null);  // 로그인 실패 시 사용자 정보 초기화
                navigate('/logintest');  // 로그인 페이지로 리다이렉트
            }
        };

        fetchUser();
    }, [navigate]);

    return (
        <div className="container">
            {user ? (
                <>
                    <h2 className="welcome-title">{user.nickname}님, 환영합니다!</h2>
                    <div className="button-group">
                        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
                    </div>
                </>
            ) : (
                <button className="login-button" onClick={() => navigate('/login')}>로그인하기</button>
            )}
        </div>
    );
}
export default loginTestPage;