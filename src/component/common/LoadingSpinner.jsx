import React from 'react';
import LogoWallet from '../../images/login/logoWallet.svg';

const spinnerStyle = {
  width: '4rem',
  height: '4rem',
  animation: 'spin 1s linear infinite',
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
};

// 회전 애니메이션 정의 (한 번만 삽입되도록 체크)
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
try {
  if (styleSheet?.cssRules && ![...styleSheet.cssRules].some(rule => rule.name === 'spin')) {
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
  }
} catch (e) {
  console.warn('keyframe 삽입 실패:', e);
}

const LoadingSpinner = () => {
  return (
    <div style={containerStyle}>
      <img src={LogoWallet} alt="로딩 중" style={spinnerStyle} />
    </div>
  );
};

export default LoadingSpinner;
