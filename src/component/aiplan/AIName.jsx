import React, { useState } from 'react';
import ProgressStep from '../aiplan/ProgressStep';
import '../../css/aiplan/AIName.css'; 

const AIPlanName = () => {
    const [planName, setPlanName] = useState('');

    const handleComplete = () => {
        alert(`'${planName}' 플랜이 생성되었습니다!`);
    };

    return (
        <>
            <div className="page-container">
                <ProgressStep currentStep={4} />

                <div className="content-container">
                    <div className="ai-title-section">
                        <h1>플랜의 이름은?</h1>
                        <p>플랜에 이름을 짓고 나의 여행일정에 저장하세요.</p>
                    </div>

                    <div className="input-container">
                        <input
                            type="text"
                            className="plan-name-input"
                            placeholder="제주도 해변 투어"
                            value={planName}
                            onChange={(e) => setPlanName(e.target.value)}
                        />
                    </div>
                    
                    <button
                        className="complete-button"
                        onClick={handleComplete}
                        disabled={!planName.trim()} 
                    >
                        완료
                    </button>
                </div>
            </div>
        </>
    );
};

export default AIPlanName;