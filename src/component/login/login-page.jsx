import React from "react";
import { useNavigate } from "react-router-dom";
import api from '../../api/axios';

function loginPage(){
    return (
        <div className="container">
            <button className="kakao-button">카카오로 로그인</button>
            <button className="kakao-button">구글로 로그인</button>
            <button className="kakao-button">이메일로 회원가입</button>
            <button className="kakao-button">로그인</button>
        </div>
    )
}